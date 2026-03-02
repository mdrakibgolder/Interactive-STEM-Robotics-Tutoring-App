import { Lesson } from '../types';

export const curriculum: Lesson[] = [
  {
    id: 'rb-1',
    title: 'Build a Stable Sensor Rig',
    track: 'Robotics',
    objective: 'Assemble an ultrasonic sensor module and route power lines safely.',
    steps: [
      'Place the sensor on a rigid mount and align it forward.',
      'Connect VCC and GND to the correct rails.',
      'Keep signal wires separated from motor lines to reduce noise.',
    ],
    difficulty: 'Beginner',
    xpReward: 120,
  },
  {
    id: 'rb-2',
    title: 'Motor Driver Wiring Checkpoint',
    track: 'Robotics',
    objective: 'Validate left/right motor polarity and PWM control routing.',
    steps: [
      'Confirm each motor channel maps to the intended wheel.',
      'Ensure PWM pins connect to speed-control inputs.',
      'Test low-speed spin and verify both wheels match direction.',
    ],
    difficulty: 'Intermediate',
    xpReward: 180,
  },
  {
    id: 'cl-1',
    title: 'Flowchart to If/Else Logic',
    track: 'Coding Logic',
    objective: 'Transform a decision flowchart into clean conditional logic.',
    steps: [
      'Identify each decision node and corresponding outcomes.',
      'Write pseudocode with clear conditions and branches.',
      'Refactor nested branches for readability.',
    ],
    difficulty: 'Beginner',
    xpReward: 130,
  },
  {
    id: 'cl-2',
    title: 'Loop Optimization Drill',
    track: 'Coding Logic',
    objective: 'Detect redundant loops and replace with efficient iteration.',
    steps: [
      'Mark repeated operations and estimate operation counts.',
      'Convert repeated condition checks into loop guards.',
      'Track output consistency with sample inputs.',
    ],
    difficulty: 'Intermediate',
    xpReward: 170,
  },
  {
    id: 'ca-1',
    title: 'CPU Pipeline Sketch Review',
    track: 'Computer Architecture',
    objective: 'Draw and label instruction pipeline stages accurately.',
    steps: [
      'Map Fetch, Decode, Execute, Memory, and Writeback blocks.',
      'Show instruction flow direction and branch hazard points.',
      'Annotate one example instruction through all stages.',
    ],
    difficulty: 'Beginner',
    xpReward: 140,
  },
  {
    id: 'ca-2',
    title: 'Cache Mapping Exercise',
    track: 'Computer Architecture',
    objective: 'Classify address bits into tag, index, and offset.',
    steps: [
      'Break sample address into binary fields.',
      'Simulate direct-mapped access and hit/miss behavior.',
      'Explain one conflict miss and suggest a mitigation.',
    ],
    difficulty: 'Advanced',
    xpReward: 220,
  },
];
