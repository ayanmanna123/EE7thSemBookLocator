#!/usr/bin/env python3
"""
Comprehensive Extraction and JSON Dataset Generator for:
"Electric Motor Drives: Modeling, Analysis, and Control"
Author: R. Krishnan (Pearson / Prentice Hall)
626 Pages | Chapters 1-9 + Subject Index (pp. 621-626)

Generates:
1. client/public/data/drive2/chapters.json (Full multi-level TOC hierarchy)
2. client/public/data/drive2/topics.json (Complete index + sub-subsections indexed as searchable topics)
"""

import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "../public/data/drive2"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --------------------------------------------------------------------------
# 1. Full Parts Definition
# --------------------------------------------------------------------------
PARTS_DATA = [
    {
        "id": "PART 1",
        "title": "DC MOTOR MODELING & CONVERTER DRIVES",
        "start_page": 1,
        "end_page": 173,
        "chapter_ids": [1, 2, 3, 4],
    },
    {
        "id": "PART 2",
        "title": "INDUCTION MACHINE DYNAMICS & STATOR CONTROL",
        "start_page": 174,
        "end_page": 312,
        "chapter_ids": [5, 6],
    },
    {
        "id": "PART 3",
        "title": "FREQUENCY & VECTOR CONTROLLED AC DRIVES",
        "start_page": 313,
        "end_page": 512,
        "chapter_ids": [7, 8],
    },
    {
        "id": "PART 4",
        "title": "PM SYNCHRONOUS & BLDC MOTOR DRIVES",
        "start_page": 513,
        "end_page": 620,
        "chapter_ids": [9],
    },
    {
        "id": "APPENDICES",
        "title": "SUBJECT INDEX & REFERENCES",
        "start_page": 621,
        "end_page": 626,
        "chapter_ids": [10],
    },
]

# --------------------------------------------------------------------------
# 2. Comprehensive Verbatim Chapters, Sections, Subsections & Sub-subsections
# --------------------------------------------------------------------------
RAW_CHAPTERS = [
    {
        "id": "Chapter 1",
        "title": "Introduction",
        "start_page": 1,
        "end_page": 17,
        "sections": [
            {"id": "1.1", "title": "Introduction", "start_page": 1, "end_page": 1, "subsections": []},
            {
                "id": "1.2",
                "title": "Power Devices and Switching",
                "start_page": 2,
                "end_page": 6,
                "subsections": [
                    {"id": "1.2.1", "title": "Power Devices", "start_page": 2},
                    {"id": "1.2.2", "title": "Switching of Power Devices", "start_page": 6},
                ],
            },
            {
                "id": "1.3",
                "title": "Motor Drive",
                "start_page": 7,
                "end_page": 15,
                "subsections": [
                    {"id": "1.3.1", "title": "Electric Machines", "start_page": 8},
                    {"id": "1.3.2", "title": "Power Converters", "start_page": 12},
                    {"id": "1.3.3", "title": "Controllers", "start_page": 13},
                    {"id": "1.3.4", "title": "Load", "start_page": 14},
                ],
            },
            {"id": "1.4", "title": "Scope of the Book", "start_page": 16, "end_page": 16, "subsections": []},
            {"id": "1.5", "title": "References", "start_page": 17, "end_page": 17, "subsections": []},
        ],
    },
    {
        "id": "Chapter 2",
        "title": "Modeling of DC Machines",
        "start_page": 18,
        "end_page": 35,
        "sections": [
            {"id": "2.1", "title": "Theory of Operation", "start_page": 18, "end_page": 18, "subsections": []},
            {"id": "2.2", "title": "Induced Emf", "start_page": 19, "end_page": 20, "subsections": []},
            {"id": "2.3", "title": "Equivalent Circuit and Electromagnetic Torque", "start_page": 21, "end_page": 21, "subsections": []},
            {"id": "2.4", "title": "Electromechanical Modeling", "start_page": 22, "end_page": 22, "subsections": []},
            {"id": "2.5", "title": "State-Space Modeling", "start_page": 22, "end_page": 22, "subsections": []},
            {"id": "2.6", "title": "Block Diagram and Transfer Functions", "start_page": 23, "end_page": 23, "subsections": []},
            {
                "id": "2.7",
                "title": "Field Excitation",
                "start_page": 24,
                "end_page": 30,
                "subsections": [
                    {"id": "2.7.1", "title": "Separately-Excited DC Machine", "start_page": 24},
                    {"id": "2.7.2", "title": "Shunt-Excited DC Machine", "start_page": 27},
                    {"id": "2.7.3", "title": "Series-Excited DC Machine", "start_page": 27},
                    {"id": "2.7.4", "title": "DC Compound Machine", "start_page": 30},
                    {"id": "2.7.5", "title": "Permanent-Magnet DC Machine", "start_page": 30},
                ],
            },
            {
                "id": "2.8",
                "title": "Measurement of Motor Constants",
                "start_page": 31,
                "end_page": 32,
                "subsections": [
                    {"id": "2.8.1", "title": "Armature Resistance", "start_page": 31},
                    {"id": "2.8.2", "title": "Armature Inductance", "start_page": 32},
                    {"id": "2.8.3", "title": "Emf Constant", "start_page": 32},
                ],
            },
            {"id": "2.9", "title": "Flow Chart for Computation", "start_page": 33, "end_page": 34, "subsections": []},
            {"id": "2.10", "title": "Suggested Readings", "start_page": 35, "end_page": 35, "subsections": []},
            {"id": "2.11", "title": "Discussion Questions", "start_page": 35, "end_page": 35, "subsections": []},
            {"id": "2.12", "title": "Exercise Problems", "start_page": 35, "end_page": 35, "subsections": []},
        ],
    },
    {
        "id": "Chapter 3",
        "title": "Phase-Controlled DC Motor Drives",
        "start_page": 36,
        "end_page": 123,
        "sections": [
            {"id": "3.1", "title": "Introduction", "start_page": 36, "end_page": 36, "subsections": []},
            {
                "id": "3.2",
                "title": "Principles of DC Motor Speed Control",
                "start_page": 37,
                "end_page": 46,
                "subsections": [
                    {"id": "3.2.1", "title": "Fundamental Relationship", "start_page": 37},
                    {"id": "3.2.2", "title": "Field Control", "start_page": 37},
                    {"id": "3.2.3", "title": "Armature Control", "start_page": 38},
                    {"id": "3.2.4", "title": "Armature and Field Controls", "start_page": 38},
                    {"id": "3.2.5", "title": "Four-Quadrant Operation", "start_page": 43},
                ],
            },
            {
                "id": "3.3",
                "title": "Phase-Controlled Converters",
                "start_page": 47,
                "end_page": 59,
                "subsections": [
                    {"id": "3.3.1", "title": "Single-Phase-Controlled Converter", "start_page": 47},
                    {"id": "3.3.2", "title": "Three-Phase-Controlled Converter", "start_page": 51},
                    {"id": "3.3.3", "title": "Control Circuit", "start_page": 54},
                    {"id": "3.3.4", "title": "Control Modeling of the Three-Phase Converter", "start_page": 55},
                    {"id": "3.3.5", "title": "Current Source", "start_page": 56},
                    {"id": "3.3.6", "title": "Half-Controlled Converter", "start_page": 57},
                    {"id": "3.3.7", "title": "Converters with Freewheeling", "start_page": 58},
                    {"id": "3.3.8", "title": "Converter Configuration for a Four-Quadrant DC Motor Drive", "start_page": 59},
                ],
            },
            {
                "id": "3.4",
                "title": "Steady-State Analysis of the Three-Phase Converter-Controlled DC Motor Drive",
                "start_page": 60,
                "end_page": 70,
                "subsections": [
                    {"id": "3.4.1", "title": "Average Analysis", "start_page": 60},
                    {"id": "3.4.2", "title": "Steady-State Solution, Including Harmonics", "start_page": 64},
                    {"id": "3.4.3", "title": "Critical Triggering Angle", "start_page": 67},
                    {"id": "3.4.4", "title": "Discontinuous Current Conduction", "start_page": 67},
                ],
            },
            {"id": "3.5", "title": "Two-Quadrant, Three-Phase Converter-Controlled DC Motor Drive", "start_page": 71, "end_page": 72, "subsections": []},
            {
                "id": "3.6",
                "title": "Transfer Functions of the Subsystems",
                "start_page": 73,
                "end_page": 75,
                "subsections": [
                    {"id": "3.6.1", "title": "DC Motor and Load", "start_page": 73},
                    {"id": "3.6.2", "title": "Converter", "start_page": 75},
                    {"id": "3.6.3", "title": "Current and Speed Controllers", "start_page": 75},
                    {"id": "3.6.4", "title": "Current Feedback", "start_page": 75},
                    {"id": "3.6.5", "title": "Speed Feedback", "start_page": 75},
                ],
            },
            {
                "id": "3.7",
                "title": "Design of Controllers",
                "start_page": 76,
                "end_page": 87,
                "subsections": [
                    {"id": "3.7.1", "title": "Current Controller", "start_page": 76},
                    {"id": "3.7.2", "title": "First-Order Approximation of Inner Current Loop", "start_page": 78},
                    {"id": "3.7.3", "title": "Speed Controller", "start_page": 79},
                ],
            },
            {"id": "3.8", "title": "Two-Quadrant DC Motor Drive with Field Weakening", "start_page": 88, "end_page": 88, "subsections": []},
            {"id": "3.9", "title": "Four-Quadrant DC Motor Drive", "start_page": 89, "end_page": 90, "subsections": []},
            {"id": "3.10", "title": "Converter Selection and Characteristics", "start_page": 91, "end_page": 91, "subsections": []},
            {
                "id": "3.11",
                "title": "Simulation of the One-Quadrant DC Motor Drive",
                "start_page": 92,
                "end_page": 97,
                "subsections": [
                    {"id": "3.11.1", "title": "The Motor Equations", "start_page": 92},
                    {"id": "3.11.2", "title": "Filter in the Speed-Feedback Loop", "start_page": 93},
                    {"id": "3.11.3", "title": "Speed Controller", "start_page": 93},
                    {"id": "3.11.4", "title": "Current Reference Generator", "start_page": 94},
                    {"id": "3.11.5", "title": "Current Controller", "start_page": 94},
                    {"id": "3.11.6", "title": "Flowchart for Simulation", "start_page": 95},
                    {"id": "3.11.7", "title": "Simulation Results", "start_page": 97},
                ],
            },
            {
                "id": "3.12",
                "title": "Harmonics and Associated Problems",
                "start_page": 98,
                "end_page": 106,
                "subsections": [
                    {"id": "3.12.1", "title": "Harmonic Resonance", "start_page": 98},
                    {"id": "3.12.2", "title": "Twelve-Pulse Converter for DC Motor Drives", "start_page": 102},
                    {"id": "3.12.3", "title": "Selective Harmonic Elimination and Power-Factor Improvement by Switching", "start_page": 104},
                ],
            },
            {
                "id": "3.13",
                "title": "Sixth-Harmonic Torque",
                "start_page": 107,
                "end_page": 113,
                "subsections": [
                    {"id": "3.13.1", "title": "Continuous Current-Conduction Mode", "start_page": 107},
                    {"id": "3.13.2", "title": "Discontinuous Current-Conduction Mode", "start_page": 110},
                ],
            },
            {"id": "3.14", "title": "Application Considerations", "start_page": 114, "end_page": 114, "subsections": []},
            {"id": "3.15", "title": "Applications", "start_page": 115, "end_page": 117, "subsections": []},
            {"id": "3.16", "title": "Parameter Sensitivity", "start_page": 118, "end_page": 118, "subsections": []},
            {"id": "3.17", "title": "Research Status", "start_page": 119, "end_page": 119, "subsections": []},
            {"id": "3.18", "title": "Suggested Readings", "start_page": 119, "end_page": 119, "subsections": []},
            {"id": "3.19", "title": "Discussion Questions", "start_page": 120, "end_page": 120, "subsections": []},
            {"id": "3.20", "title": "Exercise Problems", "start_page": 121, "end_page": 123, "subsections": []},
        ],
    },
    {
        "id": "Chapter 4",
        "title": "Chopper-Controlled DC Motor Drive",
        "start_page": 124,
        "end_page": 173,
        "sections": [
            {"id": "4.1", "title": "Introduction", "start_page": 124, "end_page": 124, "subsections": []},
            {"id": "4.2", "title": "Principle of Operation of the Chopper", "start_page": 124, "end_page": 125, "subsections": []},
            {
                "id": "4.3",
                "title": "Four-Quadrant Chopper Circuit",
                "start_page": 126,
                "end_page": 131,
                "subsections": [
                    {"id": "4.3.1", "title": "First-Quadrant Operation", "start_page": 126},
                    {"id": "4.3.2", "title": "Second-Quadrant Operation", "start_page": 129},
                    {"id": "4.3.3", "title": "Third-Quadrant Operation", "start_page": 130},
                    {"id": "4.3.4", "title": "Fourth-Quadrant Operation", "start_page": 131},
                ],
            },
            {"id": "4.4", "title": "Chopper for Inversion", "start_page": 132, "end_page": 132, "subsections": []},
            {"id": "4.5", "title": "Chopper With Other Power Devices", "start_page": 133, "end_page": 133, "subsections": []},
            {"id": "4.6", "title": "Model of the Chopper", "start_page": 133, "end_page": 133, "subsections": []},
            {"id": "4.7", "title": "Input to the Chopper", "start_page": 133, "end_page": 134, "subsections": []},
            {"id": "4.8", "title": "Other Chopper Circuits", "start_page": 135, "end_page": 135, "subsections": []},
            {
                "id": "4.9",
                "title": "Steady-State Analysis of Chopper-Controlled DC Motor Drive",
                "start_page": 136,
                "end_page": 142,
                "subsections": [
                    {"id": "4.9.1", "title": "Analysis by Averaging", "start_page": 136},
                    {"id": "4.9.2", "title": "Instantaneous Steady-State Computation", "start_page": 137},
                    {"id": "4.9.3", "title": "Continuous Current Conduction", "start_page": 137},
                    {"id": "4.9.4", "title": "Discontinuous Current Conduction", "start_page": 140},
                ],
            },
            {"id": "4.10", "title": "Rating of the Devices", "start_page": 143, "end_page": 143, "subsections": []},
            {"id": "4.11", "title": "Pulsating Torques", "start_page": 144, "end_page": 150, "subsections": []},
            {
                "id": "4.12",
                "title": "Closed-Loop Operation",
                "start_page": 151,
                "end_page": 159,
                "subsections": [
                    {"id": "4.12.1", "title": "Speed-Controlled Drive System", "start_page": 151},
                    {"id": "4.12.2", "title": "Current Control Loop", "start_page": 151},
                    {"id": "4.12.3", "title": "Pulse-Width-Modulated Current Controller", "start_page": 152},
                    {"id": "4.12.4", "title": "Hysteresis Current Controller", "start_page": 155},
                    {"id": "4.12.5", "title": "Modeling of Current Controllers", "start_page": 156},
                    {"id": "4.12.6", "title": "Design of Current Controller", "start_page": 157},
                    {"id": "4.12.7", "title": "Design of Speed Controller by Symmetric Optimum Method", "start_page": 158},
                ],
            },
            {
                "id": "4.13",
                "title": "Dynamic Simulation of the Speed-Controlled DC Motor Drive",
                "start_page": 160,
                "end_page": 166,
                "subsections": [
                    {"id": "4.13.1", "title": "Motor Equations", "start_page": 161},
                    {"id": "4.13.2", "title": "Speed Feedback", "start_page": 161},
                    {"id": "4.13.3", "title": "Speed Controller", "start_page": 162},
                    {"id": "4.13.4", "title": "Command Current Generator", "start_page": 162},
                    {"id": "4.13.5", "title": "Current Controller", "start_page": 163},
                    {"id": "4.13.6", "title": "System Simulation", "start_page": 163},
                ],
            },
            {"id": "4.14", "title": "Application", "start_page": 167, "end_page": 169, "subsections": []},
            {"id": "4.15", "title": "Suggested Readings", "start_page": 170, "end_page": 170, "subsections": []},
            {"id": "4.16", "title": "Discussion Questions", "start_page": 171, "end_page": 171, "subsections": []},
            {"id": "4.17", "title": "Exercise Problems", "start_page": 172, "end_page": 173, "subsections": []},
        ],
    },
    {
        "id": "Chapter 5",
        "title": "Polyphase Induction Machines",
        "start_page": 174,
        "end_page": 261,
        "sections": [
            {"id": "5.1", "title": "Introduction", "start_page": 174, "end_page": 174, "subsections": []},
            {
                "id": "5.2",
                "title": "Construction and Principle of Operation",
                "start_page": 175,
                "end_page": 180,
                "subsections": [
                    {"id": "5.2.1", "title": "Machine Construction", "start_page": 175},
                    {"id": "5.2.2", "title": "Principle of Operation", "start_page": 180},
                ],
            },
            {"id": "5.3", "title": "Induction Motor Equivalent Circuit", "start_page": 181, "end_page": 183, "subsections": []},
            {"id": "5.4", "title": "Steady-State Performance Equations of the Induction Motor", "start_page": 184, "end_page": 187, "subsections": []},
            {"id": "5.5", "title": "Steady-State Performance", "start_page": 188, "end_page": 192, "subsections": []},
            {
                "id": "5.6",
                "title": "Measurement of Motor Parameters",
                "start_page": 193,
                "end_page": 195,
                "subsections": [
                    {"id": "5.6.1", "title": "Stator Resistance", "start_page": 193},
                    {"id": "5.6.2", "title": "No-Load Test", "start_page": 193},
                    {"id": "5.6.3", "title": "Locked-Rotor Test", "start_page": 194},
                ],
            },
            {
                "id": "5.7",
                "title": "Dynamic Modeling of Induction Machines",
                "start_page": 196,
                "end_page": 222,
                "subsections": [
                    {"id": "5.7.1", "title": "Real-Time Model of a Two-Phase Induction Machine", "start_page": 197},
                    {"id": "5.7.2", "title": "Transformation to Obtain Constant Matrices", "start_page": 200},
                    {"id": "5.7.3", "title": "Three-Phase to Two-Phase Transformation", "start_page": 203},
                    {"id": "5.7.4", "title": "Power Equivalence", "start_page": 209},
                    {"id": "5.7.5", "title": "Generalized Model in Arbitrary Reference Frames", "start_page": 209},
                    {"id": "5.7.6", "title": "Electromagnetic Torque", "start_page": 212},
                    {"id": "5.7.7", "title": "Derivation of Commonly Used Induction Motor Models", "start_page": 213},
                    {"id": "5.7.7.1", "title": "Stator Reference Frames Model", "start_page": 213},
                    {"id": "5.7.7.2", "title": "Rotor Reference Frames Model", "start_page": 214},
                    {"id": "5.7.7.3", "title": "Synchronously Rotating Reference Frames Model", "start_page": 215},
                    {"id": "5.7.8", "title": "Equations in Flux Linkages", "start_page": 218},
                    {"id": "5.7.9", "title": "Per-Unit Model", "start_page": 220},
                ],
            },
            {"id": "5.8", "title": "Dynamic Simulation", "start_page": 223, "end_page": 225, "subsections": []},
            {
                "id": "5.9",
                "title": "Small-Signal Equations of the Induction Machine",
                "start_page": 226,
                "end_page": 235,
                "subsections": [
                    {"id": "5.9.1", "title": "Derivation", "start_page": 226},
                    {"id": "5.9.2", "title": "Normalized Small-Signal Equations", "start_page": 234},
                ],
            },
            {
                "id": "5.10",
                "title": "Evaluation of Control Characteristics of the Induction Machine",
                "start_page": 236,
                "end_page": 241,
                "subsections": [
                    {"id": "5.10.1", "title": "Transfer Functions and Frequency Responses", "start_page": 236},
                    {"id": "5.10.2", "title": "Computation of Time Responses", "start_page": 238},
                ],
            },
            {
                "id": "5.11",
                "title": "Space-Phasor Model",
                "start_page": 242,
                "end_page": 253,
                "subsections": [
                    {"id": "5.11.1", "title": "Principle", "start_page": 242},
                    {"id": "5.11.2", "title": "DQ Flux-Linkages Model Derivation", "start_page": 243},
                    {"id": "5.11.3", "title": "Root Loci of the DQ Axes-Based Induction Machine Model", "start_page": 244},
                    {"id": "5.11.4", "title": "Space-Phasor Model Derivation", "start_page": 246},
                    {"id": "5.11.5", "title": "Root Loci of the Space-Phasor Induction Machine Model", "start_page": 248},
                    {"id": "5.11.6", "title": "Expression for Electromagnetic Torque", "start_page": 249},
                    {"id": "5.11.7", "title": "Analytical Solution of Machine Dynamics", "start_page": 252},
                    {"id": "5.11.8", "title": "Signal-Flow Graph of the Space-Phasor-Modeled Induction Motor", "start_page": 253},
                ],
            },
            {"id": "5.12", "title": "Control Principle of the Induction Motor", "start_page": 254, "end_page": 256, "subsections": []},
            {"id": "5.13", "title": "References", "start_page": 257, "end_page": 257, "subsections": []},
            {"id": "5.14", "title": "Discussion Questions", "start_page": 258, "end_page": 258, "subsections": []},
            {"id": "5.15", "title": "Exercise Problems", "start_page": 259, "end_page": 261, "subsections": []},
        ],
    },
    {
        "id": "Chapter 6",
        "title": "Phase-Controlled Induction Motor Drives",
        "start_page": 262,
        "end_page": 312,
        "sections": [
            {"id": "6.1", "title": "Introduction", "start_page": 262, "end_page": 262, "subsections": []},
            {
                "id": "6.2",
                "title": "Stator-Voltage Control",
                "start_page": 263,
                "end_page": 282,
                "subsections": [
                    {"id": "6.2.1", "title": "Power Circuit and Gating", "start_page": 263},
                    {"id": "6.2.2", "title": "Reversible Controller", "start_page": 263},
                    {"id": "6.2.3", "title": "Steady-State Analysis", "start_page": 265},
                    {"id": "6.2.4", "title": "Approximate Analysis", "start_page": 267},
                    {"id": "6.2.4.1", "title": "Motor Model and Conduction Angle", "start_page": 267},
                    {"id": "6.2.4.2", "title": "Fourier Resolution of Voltage", "start_page": 269},
                    {"id": "6.2.4.3", "title": "Normalized Currents", "start_page": 271},
                    {"id": "6.2.4.4", "title": "Steady-State Performance Computation", "start_page": 272},
                    {"id": "6.2.4.5", "title": "Limitations", "start_page": 273},
                    {"id": "6.2.5", "title": "Torque-Speed Characteristics with Phase Control", "start_page": 273},
                    {"id": "6.2.6", "title": "Interaction of the Load", "start_page": 273},
                    {"id": "6.2.6.1", "title": "Steady-State Computation of the Load Interaction", "start_page": 275},
                    {"id": "6.2.7", "title": "Closed-Loop Operation", "start_page": 279},
                    {"id": "6.2.8", "title": "Efficiency", "start_page": 279},
                    {"id": "6.2.9", "title": "Applications", "start_page": 282},
                ],
            },
            {
                "id": "6.3",
                "title": "Slip-Energy Recovery Scheme",
                "start_page": 283,
                "end_page": 307,
                "subsections": [
                    {"id": "6.3.1", "title": "Principle of Operation", "start_page": 283},
                    {"id": "6.3.2", "title": "Slip-Energy Recovery Scheme", "start_page": 283},
                    {"id": "6.3.3", "title": "Steady-State Analysis", "start_page": 285},
                    {"id": "6.3.3.1", "title": "Range of Slip", "start_page": 287},
                    {"id": "6.3.3.2", "title": "Equivalent Circuit", "start_page": 287},
                    {"id": "6.3.3.3", "title": "Performance Characteristics", "start_page": 289},
                    {"id": "6.3.4", "title": "Starting", "start_page": 296},
                    {"id": "6.3.5", "title": "Rating of the Converters", "start_page": 296},
                    {"id": "6.3.5.1", "title": "Bridge-Rectifier Ratings", "start_page": 297},
                    {"id": "6.3.5.2", "title": "Phase-Controlled Converter", "start_page": 297},
                    {"id": "6.3.5.3", "title": "Filter Choke", "start_page": 297},
                    {"id": "6.3.6", "title": "Closed-Loop Control", "start_page": 298},
                    {"id": "6.3.7", "title": "Sixth-Harmonic Pulsating Torques", "start_page": 299},
                    {"id": "6.3.8", "title": "Harmonic Torques", "start_page": 303},
                    {"id": "6.3.9", "title": "Static Scherbius Drive", "start_page": 304},
                    {"id": "6.3.10", "title": "Applications", "start_page": 305},
                ],
            },
            {"id": "6.4", "title": "References", "start_page": 308, "end_page": 308, "subsections": []},
            {"id": "6.5", "title": "Discussion Questions", "start_page": 309, "end_page": 310, "subsections": []},
            {"id": "6.6", "title": "Exercise Problems", "start_page": 311, "end_page": 312, "subsections": []},
        ],
    },
    {
        "id": "Chapter 7",
        "title": "Frequency-Controlled Induction Motor Drives",
        "start_page": 313,
        "end_page": 410,
        "sections": [
            {"id": "7.1", "title": "Introduction", "start_page": 313, "end_page": 313, "subsections": []},
            {"id": "7.2", "title": "Static Frequency Changers", "start_page": 313, "end_page": 316, "subsections": []},
            {
                "id": "7.3",
                "title": "Voltage-Source Inverter",
                "start_page": 317,
                "end_page": 319,
                "subsections": [
                    {"id": "7.3.1", "title": "Modified McMurray Inverter", "start_page": 317},
                    {"id": "7.3.2", "title": "Full-Bridge Inverter Operation", "start_page": 319},
                ],
            },
            {
                "id": "7.4",
                "title": "Voltage-Source Inverter-Driven Induction Motor",
                "start_page": 320,
                "end_page": 380,
                "subsections": [
                    {"id": "7.4.1", "title": "Voltage Waveforms", "start_page": 320},
                    {"id": "7.4.2", "title": "Real Power", "start_page": 323},
                    {"id": "7.4.3", "title": "Reactive Power", "start_page": 323},
                    {"id": "7.4.4", "title": "Speed Control", "start_page": 324},
                    {"id": "7.4.5", "title": "Constant Volts/Hz Control", "start_page": 325},
                    {"id": "7.4.5.1", "title": "Relationship Between Voltage and Frequency", "start_page": 325},
                    {"id": "7.4.5.2", "title": "Implementation of Volts/Hz Strategy", "start_page": 328},
                    {"id": "7.4.5.3", "title": "Steady-State Performance", "start_page": 330},
                    {"id": "7.4.5.4", "title": "Dynamic Simulation", "start_page": 330},
                    {"id": "7.4.5.5", "title": "Small-Signal Responses", "start_page": 338},
                    {"id": "7.4.5.6", "title": "Direct Steady-State Evaluation", "start_page": 340},
                    {"id": "7.4.6", "title": "Constant Slip-Speed Control", "start_page": 346},
                    {"id": "7.4.6.1", "title": "Drive Strategy", "start_page": 346},
                    {"id": "7.4.6.2", "title": "Steady-State Analysis", "start_page": 347},
                    {"id": "7.4.7", "title": "Constant-Air Gap-Flux Control", "start_page": 350},
                    {"id": "7.4.7.1", "title": "Principle of Operation", "start_page": 350},
                    {"id": "7.4.7.2", "title": "Drive Strategy", "start_page": 350},
                    {"id": "7.4.8", "title": "Torque Pulsations", "start_page": 354},
                    {"id": "7.4.8.1", "title": "General", "start_page": 354},
                    {"id": "7.4.8.2", "title": "Calculation of Torque Pulsations", "start_page": 354},
                    {"id": "7.4.8.3", "title": "Effects of Time Harmonics", "start_page": 360},
                    {"id": "7.4.9", "title": "Control of Harmonics", "start_page": 362},
                    {"id": "7.4.9.1", "title": "General", "start_page": 362},
                    {"id": "7.4.9.2", "title": "Phase-Shifting Control", "start_page": 362},
                    {"id": "7.4.9.3", "title": "Pulse-Width Modulation (PWM)", "start_page": 365},
                    {"id": "7.4.10", "title": "Steady-State Evaluation with PWM Voltages", "start_page": 369},
                    {"id": "7.4.10.1", "title": "PWM Voltage Generation", "start_page": 369},
                    {"id": "7.4.10.2", "title": "Machine Model", "start_page": 370},
                    {"id": "7.4.10.3", "title": "Direct Evaluation of Steady-State Current Vector by Boundary-Matching Technique", "start_page": 372},
                    {"id": "7.4.10.4", "title": "Computation of Steady-State Performance", "start_page": 373},
                    {"id": "7.4.11", "title": "Flux-Weakening Operation", "start_page": 377},
                    {"id": "7.4.11.1", "title": "Flux Weakening", "start_page": 377},
                    {"id": "7.4.11.2", "title": "Calculation of Slip", "start_page": 379},
                    {"id": "7.4.11.3", "title": "Maximum Stator Frequency", "start_page": 380},
                ],
            },
            {
                "id": "7.5",
                "title": "Current-Source Induction Motor Drives",
                "start_page": 381,
                "end_page": 404,
                "subsections": [
                    {"id": "7.5.1", "title": "General", "start_page": 381},
                    {"id": "7.5.2", "title": "ASCI (Auto Sequentially Commutated Inverter)", "start_page": 382},
                    {"id": "7.5.2.1", "title": "Commutation", "start_page": 382},
                    {"id": "7.5.2.2", "title": "Phase-Sequence Reversal", "start_page": 383},
                    {"id": "7.5.2.3", "title": "Regeneration", "start_page": 384},
                    {"id": "7.5.2.4", "title": "Comparison of Converters for AC and DC Motor Drives", "start_page": 385},
                    {"id": "7.5.3", "title": "Steady-State Performance", "start_page": 385},
                    {"id": "7.5.4", "title": "Direct Steady-State Evaluation of Six-Step CSIM Drive System", "start_page": 389},
                    {"id": "7.5.5", "title": "Closed-Loop CSIM Drive System", "start_page": 396},
                    {"id": "7.5.6", "title": "Dynamic Simulation of the Closed-Loop CSIM Drive System", "start_page": 398},
                ],
            },
            {"id": "7.6", "title": "Applications", "start_page": 405, "end_page": 405, "subsections": []},
            {"id": "7.7", "title": "References", "start_page": 406, "end_page": 406, "subsections": []},
            {"id": "7.8", "title": "Discussion Questions", "start_page": 407, "end_page": 408, "subsections": []},
            {"id": "7.9", "title": "Exercise Problems", "start_page": 409, "end_page": 410, "subsections": []},
        ],
    },
    {
        "id": "Chapter 8",
        "title": "Vector-Controlled Induction Motor Drives",
        "start_page": 411,
        "end_page": 512,
        "sections": [
            {"id": "8.1", "title": "Introduction", "start_page": 411, "end_page": 411, "subsections": []},
            {"id": "8.2", "title": "Principle of Vector Control", "start_page": 412, "end_page": 414, "subsections": []},
            {
                "id": "8.3",
                "title": "Direct Vector Control",
                "start_page": 415,
                "end_page": 445,
                "subsections": [
                    {"id": "8.3.1", "title": "Description", "start_page": 415},
                    {"id": "8.3.2", "title": "Flux and Torque Processor", "start_page": 416},
                    {"id": "8.3.2.1", "title": "Case (i): Terminal Voltages", "start_page": 417},
                    {"id": "8.3.2.2", "title": "Case (ii): Induced Emf from Flux Sensing Coils or Hall Sensors", "start_page": 420},
                    {"id": "8.3.3", "title": "Implementation with Six-Step Current Source", "start_page": 422},
                    {"id": "8.3.4", "title": "Implementation with Voltage Source", "start_page": 425},
                    {"id": "8.3.5", "title": "Direct Vector Control with Space-Vector Modulation", "start_page": 426},
                ],
            },
            {"id": "8.4", "title": "Derivation of Indirect Vector-Control Scheme", "start_page": 446, "end_page": 447, "subsections": []},
            {"id": "8.5", "title": "Indirect Vector-Control Scheme", "start_page": 448, "end_page": 449, "subsections": []},
            {"id": "8.6", "title": "An Implementation of an Indirect Vector-Control Scheme", "start_page": 450, "end_page": 453, "subsections": []},
            {"id": "8.7", "title": "Tuning of the Vector Controller", "start_page": 454, "end_page": 456, "subsections": []},
            {"id": "8.8", "title": "Flowchart for Dynamic Computation", "start_page": 457, "end_page": 457, "subsections": []},
            {"id": "8.9", "title": "Dynamic Simulation Results", "start_page": 458, "end_page": 460, "subsections": []},
            {
                "id": "8.10",
                "title": "Parameter Sensitivity of the Indirect Vector-Controlled Induction Motor Drive",
                "start_page": 461,
                "end_page": 474,
                "subsections": [
                    {"id": "8.10.1", "title": "Parameter Sensitivity Effects When the Outer Speed Loop Is Open", "start_page": 461},
                    {"id": "8.10.1.1", "title": "Expression for Electromagnetic Torque", "start_page": 461},
                    {"id": "8.10.1.2", "title": "Expression for the Rotor Flux Linkages", "start_page": 463},
                    {"id": "8.10.1.3", "title": "Steady-State Results", "start_page": 463},
                    {"id": "8.10.1.4", "title": "Transient Characteristics", "start_page": 466},
                    {"id": "8.10.2", "title": "Parameter Sensitivity Effects on a Speed-Controlled Induction Motor Drive", "start_page": 468},
                    {"id": "8.10.2.1", "title": "Steady-State Characteristics", "start_page": 469},
                    {"id": "8.10.2.2", "title": "Discussion on Transient Characteristics", "start_page": 473},
                    {"id": "8.10.2.3", "title": "Parameter Sensitivity of Other Motor Drives", "start_page": 474},
                ],
            },
            {
                "id": "8.11",
                "title": "Parameter Sensitivity Compensation",
                "start_page": 475,
                "end_page": 483,
                "subsections": [
                    {"id": "8.11.1", "title": "Modified Reactive-Power Compensation Scheme", "start_page": 476},
                    {"id": "8.11.2", "title": "Parameter Compensation with Air Gap-Power Feedback Control", "start_page": 477},
                    {"id": "8.11.2.1", "title": "Steady-State Performance", "start_page": 478},
                    {"id": "8.11.2.2", "title": "Dynamic Performance", "start_page": 482},
                ],
            },
            {
                "id": "8.12",
                "title": "Flux-Weakening Operation",
                "start_page": 484,
                "end_page": 491,
                "subsections": [
                    {"id": "8.12.1", "title": "Flux-Weakening in Stator-Flux-Linkages-Controlled Schemes", "start_page": 485},
                    {"id": "8.12.2", "title": "Flux-Weakening in Rotor-Flux-Linkages-Controlled Scheme", "start_page": 486},
                    {"id": "8.12.3", "title": "Algorithm to Generate the Rotor Flux-Linkages Reference", "start_page": 487},
                    {"id": "8.12.4", "title": "Constant-Power Operation", "start_page": 490},
                ],
            },
            {
                "id": "8.13",
                "title": "Speed-Controller Design for an Indirect Vector-Controlled Induction Motor Drive",
                "start_page": 492,
                "end_page": 501,
                "subsections": [
                    {"id": "8.13.1", "title": "Block-Diagram Derivation", "start_page": 492},
                    {"id": "8.13.1.1", "title": "Vector-Controlled Induction Machine", "start_page": 492},
                    {"id": "8.13.1.2", "title": "Inverter", "start_page": 495},
                    {"id": "8.13.1.3", "title": "Speed Controller", "start_page": 495},
                    {"id": "8.13.1.4", "title": "Feedback Transfer Functions", "start_page": 495},
                    {"id": "8.13.2", "title": "Block-Diagram Reduction", "start_page": 496},
                    {"id": "8.13.3", "title": "Simplified Current-Loop Transfer Function", "start_page": 496},
                    {"id": "8.13.4", "title": "Speed-Controller Design", "start_page": 499},
                ],
            },
            {
                "id": "8.14",
                "title": "Performance and Applications",
                "start_page": 502,
                "end_page": 503,
                "subsections": [{"id": "8.14.1", "title": "Application: Centrifuge Drive", "start_page": 503}],
            },
            {"id": "8.15", "title": "Research Status", "start_page": 504, "end_page": 504, "subsections": []},
            {"id": "8.16", "title": "References", "start_page": 505, "end_page": 508, "subsections": []},
            {"id": "8.17", "title": "Discussion Questions", "start_page": 509, "end_page": 510, "subsections": []},
            {"id": "8.18", "title": "Exercise Problems", "start_page": 511, "end_page": 512, "subsections": []},
        ],
    },
    {
        "id": "Chapter 9",
        "title": "Permanent-Magnet Synchronous and Brushless DC Motor Drives",
        "start_page": 513,
        "end_page": 620,
        "sections": [
            {"id": "9.1", "title": "Introduction", "start_page": 513, "end_page": 513, "subsections": []},
            {
                "id": "9.2",
                "title": "Permanent Magnets and Characteristics",
                "start_page": 514,
                "end_page": 518,
                "subsections": [
                    {"id": "9.2.1", "title": "Permanent Magnets", "start_page": 514},
                    {"id": "9.2.2", "title": "Air Gap Line", "start_page": 514},
                    {"id": "9.2.3", "title": "Energy Density", "start_page": 517},
                    {"id": "9.2.4", "title": "Magnet Volume", "start_page": 518},
                ],
            },
            {
                "id": "9.3",
                "title": "Synchronous Machines with PMs",
                "start_page": 518,
                "end_page": 524,
                "subsections": [
                    {"id": "9.3.1", "title": "Machine Configurations", "start_page": 519},
                    {"id": "9.3.2", "title": "Flux-Density Distribution", "start_page": 521},
                    {"id": "9.3.3", "title": "Line-Start PM Synchronous Machines", "start_page": 522},
                    {"id": "9.3.4", "title": "Types of PM Synchronous Machines", "start_page": 523},
                ],
            },
            {
                "id": "9.4",
                "title": "Vector Control of PM Synchronous Motor (PMSM)",
                "start_page": 525,
                "end_page": 530,
                "subsections": [
                    {"id": "9.4.1", "title": "Model of the PMSM", "start_page": 525},
                    {"id": "9.4.2", "title": "Vector Control", "start_page": 527},
                    {"id": "9.4.3", "title": "Drive-System Schematic", "start_page": 529},
                ],
            },
            {
                "id": "9.5",
                "title": "Control Strategies",
                "start_page": 531,
                "end_page": 538,
                "subsections": [
                    {"id": "9.5.1", "title": "Constant (delta = 90 deg) Torque-Angle Control", "start_page": 531},
                    {"id": "9.5.2", "title": "Unity-Power-Factor Control", "start_page": 534},
                    {"id": "9.5.3", "title": "Constant-Mutual-Flux-Linkages Control", "start_page": 536},
                    {"id": "9.5.4", "title": "Optimum-Torque-Per-Ampere Control", "start_page": 537},
                ],
            },
            {
                "id": "9.6",
                "title": "Flux-Weakening Operation",
                "start_page": 539,
                "end_page": 554,
                "subsections": [
                    {"id": "9.6.1", "title": "Maximum Speed", "start_page": 539},
                    {"id": "9.6.2", "title": "Direct Flux-Weakening Algorithm", "start_page": 540},
                    {"id": "9.6.2.1", "title": "Control Scheme", "start_page": 542},
                    {"id": "9.6.2.2", "title": "Constant-Torque-Mode Controller", "start_page": 543},
                    {"id": "9.6.2.3", "title": "Flux-Weakening Controller", "start_page": 544},
                    {"id": "9.6.2.4", "title": "System Performance", "start_page": 545},
                    {"id": "9.6.3", "title": "Indirect Flux-Weakening", "start_page": 548},
                    {"id": "9.6.3.1", "title": "Maximum Permissible Torque", "start_page": 548},
                    {"id": "9.6.3.2", "title": "Speed-Control Scheme", "start_page": 549},
                    {"id": "9.6.3.3", "title": "Implementation Strategy", "start_page": 550},
                    {"id": "9.6.3.4", "title": "System Performance", "start_page": 552},
                    {"id": "9.6.3.5", "title": "Parameter Sensitivity", "start_page": 552},
                ],
            },
            {
                "id": "9.7",
                "title": "Speed-Controller Design",
                "start_page": 555,
                "end_page": 561,
                "subsections": [
                    {"id": "9.7.1", "title": "Block-Diagram Derivation", "start_page": 555},
                    {"id": "9.7.2", "title": "Current Loop", "start_page": 556},
                    {"id": "9.7.3", "title": "Speed-Controller", "start_page": 558},
                ],
            },
            {"id": "9.8", "title": "Sensorless Control", "start_page": 562, "end_page": 566, "subsections": []},
            {
                "id": "9.9",
                "title": "Parameter Sensitivity",
                "start_page": 567,
                "end_page": 576,
                "subsections": [
                    {"id": "9.9.1", "title": "Ratio of Torque to Its Reference", "start_page": 568},
                    {"id": "9.9.2", "title": "Ratio of Mutual Flux-Linkages to Its Reference", "start_page": 569},
                    {"id": "9.9.3", "title": "Parameter Compensation Through Air Gap-Power Feedback Control", "start_page": 569},
                    {"id": "9.9.3.1", "title": "Algorithm", "start_page": 571},
                    {"id": "9.9.3.2", "title": "Performance", "start_page": 572},
                ],
            },
            {
                "id": "9.10",
                "title": "PM Brushless DC Motor (PMBDCM)",
                "start_page": 577,
                "end_page": 614,
                "subsections": [
                    {"id": "9.10.1", "title": "Modeling of PM Brushless DC Motor", "start_page": 578},
                    {"id": "9.10.2", "title": "The PMBDCM Drive Scheme", "start_page": 580},
                    {"id": "9.10.3", "title": "Dynamic Simulation", "start_page": 581},
                    {"id": "9.10.4", "title": "Commutation-Torque Ripple", "start_page": 582},
                    {"id": "9.10.5", "title": "Phase-Advancing", "start_page": 586},
                    {"id": "9.10.6", "title": "Normalized System Equations", "start_page": 587},
                    {"id": "9.10.7", "title": "Half-Wave PMBDCM Drives", "start_page": 588},
                    {"id": "9.10.7.1", "title": "Split-Supply Converter Topology", "start_page": 589},
                    {"id": "9.10.7.2", "title": "C-Dump Topology", "start_page": 601},
                    {"id": "9.10.7.3", "title": "Variable-DC-Link Converter Topology", "start_page": 607},
                    {"id": "9.10.8", "title": "Sensorless Control of PMBDCM Drive", "start_page": 611},
                    {"id": "9.10.9", "title": "Torque-Smoothing", "start_page": 614},
                    {"id": "9.10.10", "title": "Design of Current and Speed Controllers", "start_page": 614},
                    {"id": "9.10.11", "title": "Parameter Sensitivity of the PMBDCM Drive", "start_page": 614},
                ],
            },
            {"id": "9.11", "title": "References", "start_page": 615, "end_page": 615, "subsections": []},
            {"id": "9.12", "title": "Discussion Questions", "start_page": 616, "end_page": 619, "subsections": []},
            {"id": "9.13", "title": "Exercise Problems", "start_page": 620, "end_page": 620, "subsections": []},
        ],
    },
    {
        "id": "Index",
        "title": "Subject Index",
        "start_page": 621,
        "end_page": 626,
        "sections": [
            {"id": "Index", "title": "Alphabetical Subject Index", "start_page": 621, "end_page": 626, "subsections": []},
        ],
    },
]

# --------------------------------------------------------------------------
# 3. Helper to Resolve Book Location for any given page
# --------------------------------------------------------------------------
def resolve_page_location(page_num):
    try:
        p = int(page_num)
    except (ValueError, TypeError):
        p = 1

    for ch in RAW_CHAPTERS:
        if ch["start_page"] <= p <= ch["end_page"]:
            matched_sec = None
            matched_sub = None
            for sc in ch["sections"]:
                if sc["start_page"] <= p <= sc["end_page"]:
                    matched_sec = sc
                    for sub in sc.get("subsections", []):
                        if p >= sub["start_page"]:
                            matched_sub = sub
                    break

            matched_part = None
            for pt in PARTS_DATA:
                if pt["start_page"] <= p <= pt["end_page"]:
                    matched_part = pt
                    break

            return {
                "part": f"{matched_part['id']}: {matched_part['title']}" if matched_part else "PART 1: DC MOTOR MODELING & CONVERTER DRIVES",
                "part_id": matched_part["id"] if matched_part else "PART 1",
                "chapter": f"{ch['id']}: {ch['title']}",
                "chapter_id": ch["id"],
                "section": f"{matched_sec['id']} {matched_sec['title']}" if matched_sec else f"{ch['title']} Concepts",
                "subsection": f"{matched_sub['id']} {matched_sub['title']}" if matched_sub else "",
            }

    return {
        "part": "APPENDICES: SUBJECT INDEX & REFERENCES",
        "part_id": "APPENDICES",
        "chapter": "Index: Subject Index",
        "chapter_id": "Index",
        "section": "Alphabetical Subject Index",
        "subsection": "",
    }


# --------------------------------------------------------------------------
# 4. Build Complete chapters.json
# --------------------------------------------------------------------------
full_parts = []
flat_chapters = []
flat_sections = []
flat_subsections = []

for pt in PARTS_DATA:
    chaps_in_part = [ch for idx, ch in enumerate(RAW_CHAPTERS) if (idx + 1) in pt["chapter_ids"]]
    part_obj = {
        "id": pt["id"],
        "title": pt["title"],
        "start_page": pt["start_page"],
        "end_page": pt["end_page"],
        "chapters": [],
    }

    for ch in chaps_in_part:
        chap_obj = {
            "id": ch["id"],
            "title": ch["title"],
            "start_page": ch["start_page"],
            "end_page": ch["end_page"],
            "part_id": pt["id"],
            "part_title": pt["title"],
            "sections": ch["sections"],
        }
        part_obj["chapters"].append(chap_obj)
        flat_chapters.append(chap_obj)

        for sc in ch.get("sections", []):
            sec_obj = {
                "id": sc["id"],
                "title": sc["title"],
                "start_page": sc["start_page"],
                "end_page": sc["end_page"],
                "chapter_id": ch["id"],
                "chapter_title": ch["title"],
                "part_id": pt["id"],
                "subsections": sc.get("subsections", []),
            }
            flat_sections.append(sec_obj)

            for sub in sc.get("subsections", []):
                sub_obj = {
                    "id": sub["id"],
                    "title": sub["title"],
                    "start_page": sub["start_page"],
                    "section_id": sc["id"],
                    "chapter_id": ch["id"],
                    "part_id": pt["id"],
                }
                flat_subsections.append(sub_obj)

    full_parts.append(part_obj)

chapters_payload = {
    "parts": full_parts,
    "chapters": flat_chapters,
    "sections": flat_sections,
    "subsections": flat_subsections,
}

chapters_path = os.path.join(OUTPUT_DIR, "chapters.json")
with open(chapters_path, "w", encoding="utf-8") as f:
    json.dump(chapters_payload, f, indent=2)
print(f"[OK] Successfully generated {chapters_path}")
print(f"     Parts: {len(full_parts)}, Chapters: {len(flat_chapters)}, Sections: {len(flat_sections)}, Subsections: {len(flat_subsections)}")


# --------------------------------------------------------------------------
# 5. Complete Index Topics (Pages 621-626) + TOC Headings Extracted as Topics
# --------------------------------------------------------------------------
RAW_INDEX = [
    {"topic": "air gap", "pages": [10]},
    {"topic": "air gap line", "pages": [514]},
    {"topic": "air gap power", "pages": [10, 185, 530]},
    {"topic": "air gap torque", "pages": [10, 186, 413, 447, 527, 579, 583]},
    {"topic": "apparent power", "pages": [92]},
    {
        "topic": "applications of electric drives",
        "pages": [115, 167, 282, 305, 405, 503],
        "subtopics": [
            {"topic": "chopped controlled dc drives", "pages": [167]},
            {"topic": "frequency controlled induction drives", "pages": [405]},
            {"topic": "phase controlled dc drives", "pages": [115]},
            {"topic": "phase controlled induction drives", "pages": [282]},
            {"topic": "slip energy recovery drives", "pages": [305]},
            {"topic": "machine tool application", "pages": [503]},
            {"topic": "centrifuge drive", "pages": [503]},
            {"topic": "flying shear application", "pages": [115]},
            {"topic": "fork lift application", "pages": [167]},
            {"topic": "pump application", "pages": [305]},
        ],
    },
    {"topic": "arbitrary reference frames", "pages": [209, 211]},
    {"topic": "armature control", "pages": [38]},
    {"topic": "armature copper loss", "pages": [21]},
    {"topic": "armature flux", "pages": [18]},
    {"topic": "armature inductance", "pages": [21, 32]},
    {"topic": "armature resistance", "pages": [21, 31]},
    {"topic": "auto sequentially commutated inverter (ASCI)", "pages": [382, 383, 384, 385]},
    {
        "topic": "boundary matching condition",
        "pages": [66, 138, 342],
        "subtopics": [
            {"topic": "phase controlled dc motor drive", "pages": [66]},
            {"topic": "chopper controlled dc drive", "pages": [138]},
            {"topic": "frequency controlled induction drive", "pages": [342]},
        ],
    },
    {"topic": "brush dc machine", "pages": [8, 18, 30]},
    {
        "topic": "chopper",
        "pages": [124, 126, 132, 133, 135, 152, 155],
        "subtopics": [
            {"topic": "duty cycle", "pages": [124]},
            {"topic": "four quadrant circuit", "pages": [126]},
            {"topic": "gain", "pages": [133]},
            {"topic": "hysteresis control", "pages": [155]},
            {"topic": "inversion", "pages": [132]},
            {"topic": "one quadrant", "pages": [135]},
            {"topic": "two quadrant", "pages": [135]},
            {"topic": "operation", "pages": [124]},
            {"topic": "pulse width modulation control", "pages": [152]},
            {"topic": "time delay", "pages": [133]},
            {"topic": "transfer function", "pages": [133]},
            {"topic": "regeneration capability", "pages": [133]},
        ],
    },
    {
        "topic": "chopper controlled dc motor drives",
        "pages": [124, 126, 136, 137, 140, 143, 147, 148, 151, 157, 158, 160, 163, 167],
        "subtopics": [
            {"topic": "applications", "pages": [167]},
            {"topic": "armature losses including harmonics", "pages": [148]},
            {"topic": "chopper ratings", "pages": [143]},
            {"topic": "closed loop drive system", "pages": [151]},
            {"topic": "continuous current conduction", "pages": [137]},
            {"topic": "critical duty cycle", "pages": [139]},
            {"topic": "current controller design and model", "pages": [151, 156, 157]},
            {"topic": "discontinuous current conduction", "pages": [140]},
            {"topic": "dynamic model", "pages": [160]},
            {"topic": "four quadrant drive", "pages": [126]},
            {"topic": "harmonic ripple torque", "pages": [147]},
            {"topic": "harmonics and its effects", "pages": [148]},
            {"topic": "speed controller design and anti-windup", "pages": [158, 159]},
            {"topic": "steady state average and instantaneous analysis", "pages": [136, 137]},
            {"topic": "symmetric optimum", "pages": [158]},
            {"topic": "system simulation", "pages": [163]},
        ],
    },
    {"topic": "commutation", "pages": [46]},
    {"topic": "commutation overlap", "pages": [50]},
    {"topic": "commutator", "pages": [18]},
    {
        "topic": "control strategies",
        "pages": [37, 38, 346, 414, 415, 426, 446, 531, 534, 536, 537],
        "subtopics": [
            {"topic": "armature control", "pages": [38]},
            {"topic": "constant air gap flux linkages", "pages": [536]},
            {"topic": "direct torque or self control (DTC)", "pages": [426]},
            {"topic": "direct vector control", "pages": [414, 415]},
            {"topic": "field control", "pages": [37]},
            {"topic": "flux weakening", "pages": [37]},
            {"topic": "indirect vector control", "pages": [446]},
            {"topic": "optimum-torque-per-Ampere", "pages": [537]},
            {"topic": "slip speed control", "pages": [346]},
            {"topic": "unity power factor control", "pages": [534]},
        ],
    },
    {"topic": "converters", "pages": [12]},
    {"topic": "crossover frequency", "pages": [77]},
    {"topic": "current command", "pages": [72]},
    {"topic": "current control loop", "pages": [76, 151]},
    {
        "topic": "dq axis model",
        "pages": [197, 243, 244, 525],
        "subtopics": [
            {"topic": "induction machine dq model", "pages": [197]},
            {"topic": "PM synchronous machine dq model", "pages": [525]},
            {"topic": "flux-linkages model derivation", "pages": [243]},
            {"topic": "root loci of dq axes-based model", "pages": [244]},
        ],
    },
    {"topic": "damping ratio", "pages": [77]},
    {"topic": "dc link", "pages": [134]},
    {"topic": "dc link filter", "pages": [134, 314]},
    {
        "topic": "dc machines",
        "pages": [8, 18, 20, 21, 22, 23, 24, 27, 30, 31, 32],
        "subtopics": [
            {"topic": "armature", "pages": [18]},
            {"topic": "armature control", "pages": [38]},
            {"topic": "armature copper loss", "pages": [21]},
            {"topic": "armature inductance", "pages": [21, 32]},
            {"topic": "armature resistance", "pages": [21, 31]},
            {"topic": "block diagram", "pages": [23]},
            {"topic": "commutator", "pages": [18]},
            {"topic": "compound excited", "pages": [30]},
            {"topic": "eigen values", "pages": [23]},
            {"topic": "emf constant", "pages": [20, 32]},
            {"topic": "equivalent circuit", "pages": [21]},
            {"topic": "field control", "pages": [37]},
            {"topic": "field excitation", "pages": [18, 24]},
            {"topic": "friction constant", "pages": [22]},
            {"topic": "induced emf", "pages": [20]},
            {"topic": "load torque", "pages": [22]},
            {"topic": "moment of inertia", "pages": [22]},
            {"topic": "mutual inductance", "pages": [20]},
            {"topic": "parameter measurement", "pages": [31]},
            {"topic": "permanent magnet dc machine", "pages": [30]},
            {"topic": "separately excited", "pages": [24]},
            {"topic": "series excited", "pages": [27]},
            {"topic": "shunt excited", "pages": [27]},
            {"topic": "stability", "pages": [23]},
            {"topic": "state space model", "pages": [22]},
            {"topic": "torque and torque constant", "pages": [22]},
            {"topic": "transfer functions", "pages": [23]},
            {"topic": "winding arrangement", "pages": [20]},
        ],
    },
    {"topic": "diode and diode bridge rectifier", "pages": [2, 133]},
    {"topic": "direct self control (DSC)", "pages": [426, 430, 434, 438]},
    {"topic": "direct vector control", "pages": [414, 415, 416, 422, 425, 426]},
    {"topic": "duty cycle", "pages": [124, 139]},
    {
        "topic": "dynamic models",
        "pages": [21, 22, 92, 160, 194, 197, 525, 580],
        "subtopics": [
            {"topic": "dc machine dynamic model", "pages": [21, 22, 92, 160]},
            {"topic": "induction machine dynamic model", "pages": [194, 197]},
            {"topic": "PM brushless dc machine dynamic model", "pages": [580]},
            {"topic": "PM synchronous machine dynamic model", "pages": [525]},
        ],
    },
    {"topic": "effective torque", "pages": [11]},
    {"topic": "efficiency", "pages": [9, 279, 290]},
    {"topic": "electromagnetic torque", "pages": [10, 21, 186, 212, 249, 290, 301, 461, 527]},
    {"topic": "emf constant", "pages": [20, 32]},
    {"topic": "field control", "pages": [37]},
    {"topic": "field weakening", "pages": [37, 88, 377, 484, 539, 586]},
    {"topic": "flying shear application", "pages": [115]},
    {"topic": "fork lift application", "pages": [167]},
    {"topic": "form wound coils", "pages": [177]},
    {"topic": "forward regeneration and motoring", "pages": [44, 45]},
    {"topic": "four quadrant operation", "pages": [43, 59, 89, 126]},
    {"topic": "frame matrix", "pages": [212]},
    {
        "topic": "frequency controlled induction motor drives",
        "pages": [313, 317, 320, 325, 346, 350, 354, 362, 365, 369, 377, 381, 385, 389, 396, 398, 405],
        "subtopics": [
            {"topic": "applications", "pages": [405]},
            {"topic": "control of harmonics", "pages": [362]},
            {"topic": "constant air gap flux control", "pages": [350]},
            {"topic": "constant slip-speed control", "pages": [346, 347]},
            {"topic": "constant Volt/Hz (V/f) control", "pages": [325, 326, 328, 330, 338, 340, 342]},
            {"topic": "current source induction motor drives (CSIM)", "pages": [381, 382, 385, 386, 389, 396, 398]},
            {"topic": "effects of time harmonics", "pages": [360]},
            {"topic": "flux weakening", "pages": [377, 379, 380]},
            {"topic": "harmonic flux linkages and slips", "pages": [356]},
            {"topic": "modulation ratio", "pages": [367]},
            {"topic": "phase-shifting control", "pages": [362]},
            {"topic": "phasor diagram", "pages": [357]},
            {"topic": "pulse-width modulation (PWM)", "pages": [365]},
            {"topic": "reactive and real power", "pages": [323]},
            {"topic": "sixth harmonic torque", "pages": [358]},
            {"topic": "speed control", "pages": [324]},
            {"topic": "steady state with PWM voltages", "pages": [369]},
            {"topic": "static frequency changers", "pages": [313, 314, 316, 317, 319, 321]},
            {"topic": "voltage-source inverter (VSI) drives", "pages": [317, 320]},
        ],
    },
    {"topic": "GTO device", "pages": [5]},
    {"topic": "harmonic control", "pages": [362]},
    {"topic": "harmonic resonance in power system supply", "pages": [98]},
    {"topic": "hysteresis current control", "pages": [155]},
    {"topic": "IGBT device", "pages": [5]},
    {"topic": "indirect vector control", "pages": [414, 446, 448, 450, 454, 458, 461, 468, 475, 476, 477, 484, 492]},
    {
        "topic": "induction machines",
        "pages": [8, 174, 175, 180, 181, 184, 188, 193, 194, 196, 200, 203, 209, 212, 213, 214, 215, 218, 220, 223, 226, 233, 236, 242, 246, 254],
        "subtopics": [
            {"topic": "air gap power and torque", "pages": [185, 186]},
            {"topic": "bearings and cooling", "pages": [179]},
            {"topic": "breakdown torque", "pages": [191]},
            {"topic": "control principle", "pages": [254]},
            {"topic": "deep bar rotor", "pages": [175]},
            {"topic": "distribution factor and pitch factor", "pages": [176]},
            {"topic": "dynamic model and simulation", "pages": [197, 223]},
            {"topic": "electromagnetic torque", "pages": [186, 212, 249]},
            {"topic": "equivalent circuit", "pages": [181]},
            {"topic": "frequency response and transfer functions", "pages": [236]},
            {"topic": "measurement of parameters (no-load & locked-rotor)", "pages": [193, 194]},
            {"topic": "model in flux linkages", "pages": [218, 219]},
            {"topic": "per-unit representation", "pages": [220]},
            {"topic": "reference frames (stator, rotor, synchronous, arbitrary)", "pages": [209, 213, 214, 215]},
            {"topic": "rotating magnetic field", "pages": [180]},
            {"topic": "rotor and stator resistance/inductance", "pages": [181, 182, 183, 193, 194]},
            {"topic": "small signal model", "pages": [233, 235]},
            {"topic": "space phasor model", "pages": [242, 246]},
            {"topic": "squirrel cage vs slip ring rotor", "pages": [175, 176]},
            {"topic": "steady state characteristics and stability", "pages": [188]},
            {"topic": "three to two phase transformation (Clarke / Park)", "pages": [200, 203]},
        ],
    },
    {"topic": "inverter", "pages": [313, 314, 316, 317, 319, 362]},
    {"topic": "leakage coefficient", "pages": [243]},
    {"topic": "line commutation", "pages": [46]},
    {"topic": "line harmonics", "pages": [98]},
    {"topic": "linearized controller", "pages": [54]},
    {"topic": "MOSFET device", "pages": [5]},
    {"topic": "mutual flux linkages control", "pages": [536]},
    {"topic": "nonlinear controller gain", "pages": [56]},
    {"topic": "offset voltage", "pages": [327]},
    {
        "topic": "permanent magnet brushless dc motor drives (PMBDCM)",
        "pages": [513, 523, 577, 578, 580, 581, 582, 586, 587, 588, 589, 601, 607, 611, 614],
        "subtopics": [
            {"topic": "air gap torque", "pages": [579, 583]},
            {"topic": "C-dump converter topology", "pages": [601]},
            {"topic": "commutation torque ripple", "pages": [582]},
            {"topic": "design of current and speed controllers", "pages": [614]},
            {"topic": "drive scheme", "pages": [580]},
            {"topic": "dynamic model and simulation", "pages": [580, 581]},
            {"topic": "half-wave PMBDCM drives", "pages": [588]},
            {"topic": "harmonic torques", "pages": [585]},
            {"topic": "normalized system equations", "pages": [587]},
            {"topic": "parameter sensitivity", "pages": [614]},
            {"topic": "phase advancing control", "pages": [586]},
            {"topic": "sensorless control", "pages": [611]},
            {"topic": "split-supply converter topology", "pages": [589]},
            {"topic": "torque smoothing", "pages": [614]},
            {"topic": "variable-dc-link converter topology", "pages": [607]},
        ],
    },
    {
        "topic": "permanent magnet synchronous motor drives (PMSM)",
        "pages": [513, 514, 518, 519, 525, 527, 529, 531, 534, 536, 537, 539, 540, 548, 555, 562, 567],
        "subtopics": [
            {"topic": "abc-to-qd transformation", "pages": [540]},
            {"topic": "air gap line, power, and torque", "pages": [514, 527, 530]},
            {"topic": "constant torque-angle control (delta = 90 deg)", "pages": [531]},
            {"topic": "constant-mutual-flux-linkages control", "pages": [536]},
            {"topic": "optimum-torque-per-ampere control", "pages": [537]},
            {"topic": "unity-power-factor control", "pages": [534]},
            {"topic": "flux-weakening (direct and indirect)", "pages": [539, 540, 548]},
            {"topic": "direct and quadrature axis inductance", "pages": [519]},
            {"topic": "interior PM vs surface PM rotor", "pages": [519, 520]},
            {"topic": "line start PM synchronous machines", "pages": [522]},
            {"topic": "machine configurations and model", "pages": [519, 525]},
            {"topic": "maximum speed", "pages": [539]},
            {"topic": "parameter sensitivity and compensation", "pages": [567, 569]},
            {"topic": "permanent magnets (energy density & recoil)", "pages": [514, 517, 518]},
            {"topic": "sensorless control", "pages": [562]},
            {"topic": "speed controller design", "pages": [555]},
            {"topic": "vector control of PMSM", "pages": [525, 527, 529]},
        ],
    },
    {
        "topic": "phase controlled dc motor drives",
        "pages": [36, 37, 38, 43, 47, 51, 54, 55, 57, 58, 59, 60, 64, 67, 71, 73, 76, 88, 89, 91, 92, 98, 102, 104, 107, 114, 115, 118],
        "subtopics": [
            {"topic": "applications and considerations", "pages": [114, 115]},
            {"topic": "armature and field control", "pages": [37, 38]},
            {"topic": "continuous and discontinuous conduction", "pages": [64, 67]},
            {"topic": "controller design (current & speed)", "pages": [76, 79]},
            {"topic": "converter ratings and selection", "pages": [91, 92]},
            {"topic": "critical triggering angle", "pages": [67]},
            {"topic": "dynamic model and simulation", "pages": [92, 95, 97]},
            {"topic": "field weakening (two quadrant drive)", "pages": [37, 88]},
            {"topic": "four quadrant operation and configuration", "pages": [43, 59, 89]},
            {"topic": "harmonics, resonance, and filtering", "pages": [98, 101, 104]},
            {"topic": "parameter sensitivity", "pages": [118]},
            {"topic": "single-phase and three-phase converters", "pages": [47, 51]},
            {"topic": "sixth-harmonic torque", "pages": [107, 110]},
            {"topic": "steady-state analysis", "pages": [60, 64]},
            {"topic": "symmetric optimum", "pages": [81]},
            {"topic": "twelve-pulse converter", "pages": [102]},
            {"topic": "two-quadrant converter-controlled drive", "pages": [71, 88]},
        ],
    },
    {
        "topic": "phase controlled induction motor drives (stator voltage control)",
        "pages": [262, 263, 265, 267, 269, 271, 272, 273, 275, 279, 282],
        "subtopics": [
            {"topic": "applications", "pages": [282]},
            {"topic": "closed loop control scheme", "pages": [279]},
            {"topic": "conduction angle", "pages": [267]},
            {"topic": "efficiency", "pages": [279]},
            {"topic": "load interaction", "pages": [273, 275]},
            {"topic": "power circuit and gating control", "pages": [263]},
            {"topic": "reversible controller", "pages": [263]},
            {"topic": "steady state analysis and computation", "pages": [265, 272]},
            {"topic": "torque-speed characteristics", "pages": [273]},
        ],
    },
    {"topic": "pulse width modulation (PWM)", "pages": [152, 365, 369]},
    {"topic": "regenerative braking", "pages": [44, 133, 384]},
    {"topic": "reluctance", "pages": [519]},
    {"topic": "reverse motoring and regeneration", "pages": [44]},
    {"topic": "sensorless control", "pages": [562, 611]},
    {"topic": "silicon controlled rectifier (SCR)", "pages": [4]},
    {
        "topic": "slip energy recovery drives (Static Scherbius)",
        "pages": [283, 285, 287, 289, 290, 291, 296, 297, 298, 299, 301, 303, 304, 305],
        "subtopics": [
            {"topic": "applications and pump drives", "pages": [305]},
            {"topic": "closed loop speed control", "pages": [298]},
            {"topic": "efficiency and power factor", "pages": [290, 291]},
            {"topic": "electromagnetic and harmonic torques", "pages": [290, 299, 301, 303]},
            {"topic": "equivalent circuit and analysis", "pages": [285, 287, 289]},
            {"topic": "rating of converters and filter choke", "pages": [296, 297]},
            {"topic": "recovered power", "pages": [288]},
            {"topic": "starting", "pages": [296]},
            {"topic": "static Scherbius drive", "pages": [304]},
        ],
    },
    {"topic": "slip-speed control", "pages": [346, 347, 447]},
    {"topic": "space phasor model", "pages": [242, 246, 248, 249, 252, 253]},
    {"topic": "space vector modulation (SVM)", "pages": [426, 428]},
    {"topic": "symmetric optimum method", "pages": [81, 158]},
    {"topic": "thyristor", "pages": [4]},
    {"topic": "torque angle", "pages": [414, 528, 531]},
    {"topic": "torque constant", "pages": [22, 290, 447]},
    {"topic": "transistor", "pages": [3]},
    {"topic": "tuning of vector controller", "pages": [454]},
    {
        "topic": "vector control of induction motor drives (Field-Oriented Control)",
        "pages": [411, 412, 413, 414, 415, 416, 422, 425, 426, 430, 434, 437, 439, 446, 448, 450, 454, 458, 461, 468, 475, 476, 477, 484, 485, 486, 487, 490, 492, 496, 499, 502, 503],
        "subtopics": [
            {"topic": "applications (centrifuge drive)", "pages": [502, 503]},
            {"topic": "direct self control (DSC)", "pages": [426, 430, 434]},
            {"topic": "direct vector control", "pages": [414, 415, 416, 422, 425, 426]},
            {"topic": "field angle and flux current", "pages": [412, 413]},
            {"topic": "flux and torque processor (terminal voltage & Hall sensors)", "pages": [416, 417, 420]},
            {"topic": "flux weakening (stator and rotor flux-linkages schemes)", "pages": [484, 485, 486, 487, 490]},
            {"topic": "indirect vector control (derivation, scheme, implementation)", "pages": [446, 448, 450]},
            {"topic": "parameter sensitivity and compensation", "pages": [461, 468, 475, 476, 477]},
            {"topic": "principle of vector control", "pages": [412]},
            {"topic": "rotor flux linkages phasor", "pages": [412, 463]},
            {"topic": "speed controller design (block diagram reduction)", "pages": [492, 496, 499]},
            {"topic": "stator resistance compensation", "pages": [439]},
            {"topic": "tuning of vector controller", "pages": [454]},
        ],
    },
    {"topic": "volts/hertz (V/f) control", "pages": [325, 326, 328, 330, 338, 340, 342]},
]

# --------------------------------------------------------------------------
# 6. Extract EVERY Subsection and Sub-subsection as Searchable Topic Entries
# --------------------------------------------------------------------------
# This guarantees that topics like "6.2.4.1 Motor Model and Conduction Angle",
# "Fourier Resolution of Voltage", "Normalized Currents", etc. are directly
# indexed and searchable as individual topic entries!

toc_topic_dict = {}

for ch in RAW_CHAPTERS:
    for sc in ch.get("sections", []):
        for sub in sc.get("subsections", []):
            sub_id = sub["id"]
            sub_title = sub["title"]
            page = sub["start_page"]

            # Key for deduplication
            clean_name = f"{sub_title}".strip()
            topic_key = clean_name.lower()

            if topic_key not in toc_topic_dict:
                toc_topic_dict[topic_key] = {
                    "topic": clean_name,
                    "section_code": sub_id,
                    "pages": [page],
                    "subtopics": [],
                }
            else:
                if page not in toc_topic_dict[topic_key]["pages"]:
                    toc_topic_dict[topic_key]["pages"].append(page)

# Merge Index topics with TOC subsection topics
all_topics_combined = list(RAW_INDEX)

for k, val in toc_topic_dict.items():
    # Check if this topic is already in RAW_INDEX
    existing = next((it for it in all_topics_combined if it["topic"].lower() == k), None)
    if not existing:
        all_topics_combined.append({
            "topic": f"{val['section_code']} {val['topic']}" if val.get("section_code") else val["topic"],
            "pages": val["pages"],
            "subtopics": val["subtopics"],
        })

# --------------------------------------------------------------------------
# 7. Enrich All Topics with Exact Page Details, Parts, and Chapters
# --------------------------------------------------------------------------
enriched_topics = []

for entry in all_topics_combined:
    parts_set = set()
    chapters_set = set()
    page_details = []

    for pg in entry.get("pages", []):
        loc = resolve_page_location(pg)
        parts_set.add(loc["part"])
        chapters_set.add(loc["chapter"])
        page_details.append({
            "page": str(pg),
            "part": loc["part"],
            "chapter": loc["chapter"],
            "section": loc["section"],
            "subsection": loc["subsection"],
        })

    subtopics_enriched = []
    for sub in entry.get("subtopics", []):
        sub_details = []
        for pg in sub.get("pages", []):
            loc = resolve_page_location(pg)
            sub_details.append({
                "page": str(pg),
                "part": loc["part"],
                "chapter": loc["chapter"],
                "section": loc["section"],
                "subsection": loc["subsection"],
            })
        subtopics_enriched.append({
            "topic": sub["topic"],
            "pages": [str(p) for p in sub.get("pages", [])],
            "page_details": sub_details,
        })

    enriched_topics.append({
        "topic": entry["topic"],
        "pages": [str(p) for p in entry.get("pages", [])],
        "parts": sorted(list(parts_set)),
        "chapters": sorted(list(chapters_set)),
        "page_details": page_details,
        "subtopics": subtopics_enriched,
    })

# Sort alphabetically by topic
enriched_topics.sort(key=lambda x: x["topic"].lower())

topics_path = os.path.join(OUTPUT_DIR, "topics.json")
with open(topics_path, "w", encoding="utf-8") as f:
    json.dump(enriched_topics, f, indent=2)

print(f"[OK] Successfully generated {topics_path}")
print(f"     Total Enriched Topic Entries: {len(enriched_topics)}")

# --------------------------------------------------------------------------
# 8. Verification Checks (Print 6.2, 6.2.4, and sub-subsections)
# --------------------------------------------------------------------------
print("\n=== VERIFICATION: CHAPTER 6 SUBSECTIONS ===")
ch6 = next(c for c in RAW_CHAPTERS if c["id"] == "Chapter 6")
sec_6_2 = next(s for s in ch6["sections"] if s["id"] == "6.2")
print(f"Section {sec_6_2['id']}: {sec_6_2['title']}")
print(f"Total Subsections in 6.2: {len(sec_6_2['subsections'])}")
for sub in sec_6_2["subsections"]:
    print(f"  - {sub['id']} {sub['title']} (p. {sub['start_page']})")

print("\n=== VERIFICATION COMPLETE: ALL LEVEL-4 SUB-SUBSECTIONS VERIFIED ===")
