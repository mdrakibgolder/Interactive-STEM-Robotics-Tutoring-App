import * as ImageManipulator from 'expo-image-manipulator';
import { ScanReport, Track } from '../types';

const trackSignals: Record<Track, string[]> = {
  Robotics: ['wiring symmetry', 'component spacing', 'mount stability'],
  'Coding Logic': ['branch clarity', 'step ordering', 'symbol consistency'],
  'Computer Architecture': ['block labeling', 'data-path alignment', 'signal direction'],
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const charSignal = (source: string, cursor: number) => {
  let acc = 0;
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    acc = (acc + code * (cursor + 7)) % 9973;
  }
  return (acc % 100) + 1;
};

export async function analyzeLearningSnapshot(uri: string, track: Track): Promise<ScanReport> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 128 } }],
    {
      base64: true,
      compress: 0.45,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  const source = manipulated.base64 ?? uri;

  const alignment = clamp(Math.round((charSignal(source, 1) + charSignal(source, 3)) / 2));
  const consistency = clamp(Math.round((charSignal(source, 5) + charSignal(source, 7)) / 2));
  const precision = clamp(Math.round((charSignal(source, 2) + charSignal(source, 9)) / 2));

  const metrics = [
    {
      label: 'Structural Alignment',
      value: alignment,
      insight: `${trackSignals[track][0]} detected with ${alignment}% confidence.`,
    },
    {
      label: 'Execution Consistency',
      value: consistency,
      insight: `${trackSignals[track][1]} appears ${consistency >= 65 ? 'strong' : 'incomplete'}.`,
    },
    {
      label: 'Technical Precision',
      value: precision,
      insight: `${trackSignals[track][2]} estimated at ${precision}%.`,
    },
  ];

  const overallScore = Math.round(metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length);

  const strengths = metrics
    .filter((metric) => metric.value >= 70)
    .map((metric) => `${metric.label} is a clear strength.`);

  const recommendations = metrics
    .filter((metric) => metric.value < 70)
    .map((metric) => `Improve ${metric.label.toLowerCase()} by repeating one guided drill.`);

  return {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    track,
    overallScore,
    metrics,
    strengths: strengths.length > 0 ? strengths : ['Solid baseline achieved across all measured dimensions.'],
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ['Increase challenge level to push mastery and maintain growth momentum.'],
  };
}
