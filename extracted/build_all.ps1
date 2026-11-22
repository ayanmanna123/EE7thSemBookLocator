$ErrorActionPreference = "Stop"

# 1. Parse batch_1 from create_batch1.py
$pyContent = Get-Content -Path "c:\Users\manna\Pictures\test\extracted\create_batch1.py" -Raw -Encoding UTF8
$pattern = '\("(?<img>IMG_[^"]+)",\s*(?<page>\d+)\):\s*"""(?<body>[\s\S]*?)"""'
$matches1 = [regex]::Matches($pyContent, $pattern)

function Parse-IndexLine([string]$line) {
    $s = $line.Trim()
    $see = $null
    $see_also = $null
    if ($s.Contains(". See also ")) {
        $idx = $s.IndexOf(". See also ")
        $see_also = $s.Substring($idx + 11).Trim()
        $s = $s.Substring(0, $idx).Trim()
    } elseif ($s.Contains(". See ")) {
        $idx = $s.IndexOf(". See ")
        $see = $s.Substring($idx + 6).Trim()
        $s = $s.Substring(0, $idx).Trim()
    }
    $m = [regex]::Match($s, '^(.*?),\s*(\d+(?:[-–]\d+)?(?:\s*,\s*\d+(?:[-–]\d+)?)*)$')
    if ($m.Success) {
        $topic = $m.Groups[1].Value.Trim()
        $pages = @($m.Groups[2].Value.Split(',') | ForEach-Object { $_.Trim() })
    } else {
        $topic = $s.Trim()
        $pages = @()
    }
    if ($topic.EndsWith("—Cont.")) {
        $topic = $topic.Substring(0, $topic.Length - 6).Trim()
    }
    return [ordered]@{
        topic = $topic
        pages = $pages
        see = $see
        see_also = $see_also
    }
}

$batch1 = @()
foreach ($m in $matches1) {
    $img = $m.Groups['img'].Value
    $pageNo = [int]$m.Groups['page'].Value
    $body = $m.Groups['body'].Value
    $entries = New-Object System.Collections.ArrayList
    foreach ($rawLine in ($body -split "`r?`n")) {
        if ([string]::IsNullOrWhiteSpace($rawLine)) { continue }
        $isSub = $rawLine.StartsWith("  ")
        $parsed = Parse-IndexLine $rawLine
        if ($isSub) {
            $lastIdx = $entries.Count - 1
            $entries[$lastIdx].subtopics += $parsed
        } else {
            $parsed['subtopics'] = @()
            [void]$entries.Add($parsed)
        }
    }
    $batch1 += [ordered]@{
        image = $img
        index_page = $pageNo
        entries = $entries
    }
}

$batch1Json = $batch1 | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText("c:\Users\manna\Pictures\test\extracted\batch_1.json", $batch1Json, [System.Text.Encoding]::UTF8)

# 2. Load all 6 batches and merge
$allPages = @()
for ($i = 1; $i -le 6; $i++) {
    $path = "c:\Users\manna\Pictures\test\extracted\batch_$i.json"
    $jsonText = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $batchData = $jsonText | ConvertFrom-Json
    foreach ($p in $batchData) {
        $allPages += $p
    }
}

$allPages = $allPages | Sort-Object { [int]$_.index_page }

$mergedEntries = New-Object System.Collections.ArrayList

foreach ($page in $allPages) {
    $idxPage = [int]$page.index_page
    $imgName = $page.image
    foreach ($entry in $page.entries) {
        $tName = [string]$entry.topic
        if ($tName.EndsWith("—Cont.") -or $tName.EndsWith("-Cont.")) {
            $tName = ($tName -replace '[—-]Cont\.$', '').Trim()
        }
        $entryPages = @()
        if ($null -ne $entry.pages) {
            foreach ($pg in $entry.pages) {
                if (-not [string]::IsNullOrWhiteSpace([string]$pg)) {
                    $entryPages += ([string]$pg).Trim()
                }
            }
        }
        $subList = @()
        if ($null -ne $entry.subtopics) {
            foreach ($sub in $entry.subtopics) {
                $sPages = @()
                if ($null -ne $sub.pages) {
                    foreach ($sp in $sub.pages) {
                        if (-not [string]::IsNullOrWhiteSpace([string]$sp)) {
                            $sPages += ([string]$sp).Trim()
                        }
                    }
                }
                $subList += [ordered]@{
                    topic = [string]$sub.topic
                    pages = $sPages
                    see = $sub.see
                    see_also = $sub.see_also
                }
            }
        }

        if ($tName -eq "_CONTINUED_FROM_PREV_PAGE" -and $mergedEntries.Count -gt 0) {
            $prev = $mergedEntries[$mergedEntries.Count - 1]
            $prev.subtopics = @($prev.subtopics) + $subList
            continue
        }

        if ($mergedEntries.Count -gt 0) {
            $prev = $mergedEntries[$mergedEntries.Count - 1]
            if ($prev.topic.ToLower() -eq $tName.ToLower()) {
                foreach ($pg in $entryPages) {
                    if ($prev.pages -notcontains $pg) {
                        $prev.pages = @($prev.pages) + $pg
                    }
                }
                $prev.subtopics = @($prev.subtopics) + $subList
                if (-not $prev.see -and $entry.see) { $prev.see = $entry.see }
                if (-not $prev.see_also -and $entry.see_also) { $prev.see_also = $entry.see_also }
                continue
            }
        }

        $newObj = [ordered]@{
            topic = $tName
            pages = $entryPages
            see = $entry.see
            see_also = $entry.see_also
            index_page = $idxPage
            image = $imgName
            subtopics = $subList
        }
        [void]$mergedEntries.Add($newObj)
    }
}

Write-Output "Total merged main topics: $($mergedEntries.Count)"
$totalSubtopics = 0
foreach ($e in $mergedEntries) {
    $totalSubtopics += $e.subtopics.Count
}
Write-Output "Total subtopics: $totalSubtopics"

# Save topics.json
$finalJson = $mergedEntries | ConvertTo-Json -Depth 10
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\manna\Pictures\test\topics.json", $finalJson, $utf8NoBom)

# Save topics_data.js
$jsContent = "window.BOOK_INDEX_DATA = " + $finalJson + ";"
[System.IO.File]::WriteAllText("c:\Users\manna\Pictures\test\topics_data.js", $jsContent, $utf8NoBom)

# Save ALL_TOPICS_AND_PAGES.md
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# Complete Book Index: Topics & Page Numbers (Pages 1111–1134)")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("- **Main Topics:** $($mergedEntries.Count)")
[void]$sb.AppendLine("- **Subtopics:** $totalSubtopics")
[void]$sb.AppendLine("- **Total Index Entries:** $($mergedEntries.Count + $totalSubtopics)")
[void]$sb.AppendLine("")

$currentPage = 0
foreach ($e in $mergedEntries) {
    if ($e.index_page -ne $currentPage) {
        $currentPage = $e.index_page
        [void]$sb.AppendLine("## Index Page $currentPage ($($e.image))")
        [void]$sb.AppendLine("")
    }
    $pgStr = if ($e.pages.Count -gt 0) { ($e.pages -join ", ") } else { "" }
    $xref = ""
    if ($e.see) { $xref += " *(See $($e.see))*" }
    if ($e.see_also) { $xref += " *(See also $($e.see_also))*" }
    if ($pgStr -ne "") {
        [void]$sb.AppendLine("- **$($e.topic)**: $pgStr$xref")
    } else {
        [void]$sb.AppendLine("- **$($e.topic)**$xref")
    }
    foreach ($sub in $e.subtopics) {
        $spgStr = if ($sub.pages.Count -gt 0) { ($sub.pages -join ", ") } else { "" }
        $sxref = ""
        if ($sub.see) { $sxref += " *(See $($sub.see))*" }
        if ($sub.see_also) { $sxref += " *(See also $($sub.see_also))*" }
        if ($spgStr -ne "") {
            [void]$sb.AppendLine("  - $($sub.topic): $spgStr$sxref")
        } else {
            [void]$sb.AppendLine("  - $($sub.topic)$sxref")
        }
    }
}

[System.IO.File]::WriteAllText("c:\Users\manna\Pictures\test\ALL_TOPICS_AND_PAGES.md", $sb.ToString(), $utf8NoBom)
Write-Output "Successfully generated topics.json, topics_data.js, and ALL_TOPICS_AND_PAGES.md!"

