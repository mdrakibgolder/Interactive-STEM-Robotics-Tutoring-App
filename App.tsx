import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { curriculum } from './src/data/curriculum';
import { analyzeLearningSnapshot } from './src/engine/analysis';
import { Lesson, ScanReport, Track } from './src/types';

type AppTab = 'Learn' | 'Scan' | 'Progress';

const tracks: Track[] = ['Robotics', 'Coding Logic', 'Computer Architecture'];

const xpToLevel = (xp: number) => Math.floor(xp / 300) + 1;

const scoreToTier = (score: number) => {
  if (score >= 85) {
    return 'Expert';
  }
  if (score >= 70) {
    return 'Builder';
  }
  if (score >= 55) {
    return 'Explorer';
  }
  return 'Starter';
};

const progressWidth = (value: number) => `${Math.max(6, Math.min(100, value))}%`;

export default function App() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState<AppTab>('Learn');
  const [activeTrack, setActiveTrack] = useState<Track>('Robotics');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [xp, setXp] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const lessons = useMemo(
    () => curriculum.filter((lesson) => lesson.track === activeTrack),
    [activeTrack],
  );

  const level = xpToLevel(xp);
  const latestReport = reports[0];
  const avgScore =
    reports.length > 0
      ? Math.round(reports.reduce((sum, report) => sum + report.overallScore, 0) / reports.length)
      : 0;

  const completeLesson = (lesson: Lesson) => {
    if (completedLessons.includes(lesson.id)) {
      return;
    }
    setCompletedLessons((prev) => [...prev, lesson.id]);
    setXp((prev) => prev + lesson.xpReward);
  };

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      if (!shot?.uri) {
        return;
      }

      const report = await analyzeLearningSnapshot(shot.uri, activeTrack);
      setReports((prev) => [report, ...prev].slice(0, 20));
      setXp((prev) => prev + 90 + Math.round(report.overallScore / 4));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const badges = [
    completedLessons.length >= 2 ? 'Lesson Sprinter' : null,
    completedLessons.length >= 4 ? 'Consistency Coder' : null,
    reports.length >= 3 ? 'Vision Analyst' : null,
    avgScore >= 75 && reports.length > 0 ? 'Precision Pro' : null,
  ].filter(Boolean) as string[];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Interactive STEM & Robotics Tutor</Text>
        <Text style={styles.subtitle}>Camera-guided practice with contextual coaching</Text>
      </View>

      <View style={styles.trackRow}>
        {tracks.map((track) => (
          <Pressable
            key={track}
            onPress={() => setActiveTrack(track)}
            style={[styles.trackChip, activeTrack === track && styles.trackChipActive]}
          >
            <Text style={[styles.trackChipText, activeTrack === track && styles.trackChipTextActive]}>
              {track}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.tabRow}>
        {(['Learn', 'Scan', 'Progress'] as AppTab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'Learn' && (
        <ScrollView contentContainerStyle={styles.content}>
          {lessons.map((lesson) => {
            const completed = completedLessons.includes(lesson.id);
            return (
              <View key={lesson.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{lesson.title}</Text>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{lesson.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.objective}>{lesson.objective}</Text>
                {lesson.steps.map((step) => (
                  <Text key={step} style={styles.stepText}>
                    • {step}
                  </Text>
                ))}
                <View style={styles.cardBottom}>
                  <Text style={styles.reward}>+{lesson.xpReward} XP</Text>
                  <Pressable
                    onPress={() => completeLesson(lesson)}
                    style={[styles.actionButton, completed && styles.actionButtonDone]}
                  >
                    <Text style={styles.actionText}>{completed ? 'Completed' : 'Mark Complete'}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {activeTab === 'Scan' && (
        <View style={styles.scanPanel}>
          {!permission ? (
            <ActivityIndicator color="#9dc1ff" />
          ) : permission.granted ? (
            <>
              <CameraView ref={cameraRef} style={styles.camera} facing="back" mode="picture" />
              <Pressable style={styles.captureButton} onPress={captureAndAnalyze}>
                <Text style={styles.captureText}>{isAnalyzing ? 'Analyzing…' : 'Capture & Analyze'}</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.permissionCard}>
              <Text style={styles.permissionTitle}>Camera permission required</Text>
              <Text style={styles.permissionBody}>
                Allow access so the app can analyze robotics builds, handwritten logic, and hardware
                layouts.
              </Text>
              <Pressable style={styles.captureButton} onPress={requestPermission}>
                <Text style={styles.captureText}>Grant Camera Access</Text>
              </Pressable>
            </View>
          )}

          {latestReport && (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Latest Feedback • {latestReport.track}</Text>
              <Text style={styles.reportScore}>Overall Score: {latestReport.overallScore}%</Text>
              {latestReport.metrics.map((metric) => (
                <View key={metric.label} style={styles.metricWrap}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <Text style={styles.metricValue}>{metric.value}%</Text>
                  </View>
                  <View style={styles.metricTrack}>
                    <View style={[styles.metricFill, { width: progressWidth(metric.value) }]} />
                  </View>
                  <Text style={styles.metricInsight}>{metric.insight}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {activeTab === 'Progress' && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Performance Snapshot</Text>
            <Text style={styles.snapshotLine}>Level: {level}</Text>
            <Text style={styles.snapshotLine}>XP: {xp}</Text>
            <Text style={styles.snapshotLine}>Completed Lessons: {completedLessons.length}</Text>
            <Text style={styles.snapshotLine}>Scan Sessions: {reports.length}</Text>
            <Text style={styles.snapshotLine}>Average Scan Score: {avgScore}%</Text>
            <Text style={styles.snapshotLine}>Current Tier: {scoreToTier(avgScore)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Unlocked Badges</Text>
            {badges.length === 0 ? (
              <Text style={styles.emptyState}>Complete lessons and scans to unlock badges.</Text>
            ) : (
              badges.map((badge) => (
                <View key={badge} style={styles.badgeRow}>
                  <Text style={styles.badgeDot}>◆</Text>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Coach Next-Step Recommendations</Text>
            {latestReport ? (
              latestReport.recommendations.map((item) => (
                <Text key={item} style={styles.stepText}>
                  • {item}
                </Text>
              ))
            ) : (
              <Text style={styles.emptyState}>Run your first camera scan to generate targeted coaching.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c1326',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: {
    color: '#f2f7ff',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9eb1d9',
    fontSize: 13,
    marginTop: 4,
  },
  trackRow: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  trackChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2f4373',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#101b37',
  },
  trackChipActive: {
    backgroundColor: '#2b6fff',
    borderColor: '#2b6fff',
  },
  trackChipText: {
    color: '#bed0f6',
    fontSize: 12,
    fontWeight: '600',
  },
  trackChipTextActive: {
    color: '#f4f8ff',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#111e3b',
    marginHorizontal: 14,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#2a62e9',
  },
  tabText: {
    color: '#9fb4e4',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    padding: 14,
    gap: 12,
    paddingBottom: 34,
  },
  card: {
    backgroundColor: '#121f3f',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#253a66',
    padding: 14,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    color: '#eef4ff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
  },
  objective: {
    color: '#b9caeb',
    lineHeight: 20,
  },
  stepText: {
    color: '#d9e6ff',
    lineHeight: 20,
  },
  pill: {
    borderRadius: 999,
    backgroundColor: '#294276',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    color: '#deebff',
    fontWeight: '600',
    fontSize: 11,
  },
  cardBottom: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reward: {
    color: '#a3bbeb',
    fontWeight: '700',
  },
  actionButton: {
    borderRadius: 10,
    backgroundColor: '#2b6fff',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  actionButtonDone: {
    backgroundColor: '#1e944f',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  scanPanel: {
    flex: 1,
    padding: 14,
    gap: 12,
  },
  camera: {
    width: '100%',
    height: 240,
    borderRadius: 14,
    overflow: 'hidden',
  },
  captureButton: {
    backgroundColor: '#2b6fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  captureText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  permissionCard: {
    backgroundColor: '#121f3f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#253a66',
    padding: 14,
    gap: 10,
  },
  permissionTitle: {
    color: '#eef4ff',
    fontWeight: '700',
    fontSize: 16,
  },
  permissionBody: {
    color: '#c2d2ef',
    lineHeight: 20,
  },
  reportCard: {
    backgroundColor: '#111e38',
    borderWidth: 1,
    borderColor: '#253a66',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  reportTitle: {
    color: '#eaf1ff',
    fontWeight: '700',
    fontSize: 15,
  },
  reportScore: {
    color: '#b2c6ef',
    fontWeight: '700',
  },
  metricWrap: {
    gap: 5,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: '#d8e5ff',
    fontWeight: '600',
  },
  metricValue: {
    color: '#b9cdf5',
    fontWeight: '700',
  },
  metricTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#223a69',
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3f8cff',
  },
  metricInsight: {
    color: '#9eb3da',
    lineHeight: 18,
  },
  snapshotLine: {
    color: '#d5e3ff',
    lineHeight: 22,
  },
  emptyState: {
    color: '#a6bcdf',
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeDot: {
    color: '#66a3ff',
    fontSize: 14,
  },
  badgeText: {
    color: '#dce9ff',
    fontWeight: '600',
  },
});
