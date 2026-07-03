import type { EnergyMatrix, AIInsight, MicroTask } from '@core/numerology/types';

// ─── Narrative Generator ────────────────────────────────────────
// NOTE: Rule-based for MVP. ONNX model integration (numerology-optimized.onnx)
// is planned for a later version — will require expo-asset for resolving the
// model URI and an actual InferenceSession.run() call with a Tensor input
// built from the matrix features below.

class NumerologyNarrativeGenerator {
  generate(matrix: EnergyMatrix): { narrative: string; confidence: number } {
    const patterns = {
      highEnergy: matrix.matrix.lifePath > 5,
      balanced: matrix.energyGrid.summary.balance > 0.5,
      spiritual: matrix.matrix.soulUrge > 7,
      creative: matrix.matrix.expression > 5,
    };

    const parts: string[] = [];

    if (patterns.highEnergy) {
      parts.push(
        'Energi Anda sangat tinggi saat ini. Ini adalah waktu yang tepat untuk mengambil tindakan besar dan mewujudkan impian Anda.'
      );
    } else {
      parts.push(
        'Energi Anda dalam kondisi stabil. Manfaatkan momentum ini untuk merencanakan langkah-langkah strategis.'
      );
    }

    if (patterns.balanced) {
      parts.push(
        'Keseimbangan hidup Anda terjaga dengan baik. Pertahankan harmoni antara aspek spiritual dan material.'
      );
    }

    if (patterns.spiritual) {
      parts.push('Panggilan spiritual Anda kuat. Luangkan waktu untuk introspeksi dan meditasi.');
    }

    if (patterns.creative) {
      parts.push('Kreativitas Anda sedang memuncak. Ekspresikan diri melalui seni, tulisan, atau inovasi.');
    }

    return {
      narrative: parts.join(' '),
      confidence: 0.75,
    };
  }
}

// ─── AI Engine ──────────────────────────────────────────────────

export class NumerologyAI {
  private generator: NumerologyNarrativeGenerator;
  private isInitialized = false;

  constructor() {
    this.generator = new NumerologyNarrativeGenerator();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    // MVP: no model to load, this is a no-op placeholder so callers
    // (e.g. App.tsx) can keep awaiting initialize() without changes
    // once ONNX support is added later.
    this.isInitialized = true;
  }

  async interpret(matrix: EnergyMatrix): Promise<AIInsight> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      const { narrative, confidence } = this.generator.generate(matrix);
      const microTasks = this.generateMicroTasks(matrix);
      const inferenceTime = Date.now() - startTime;
      console.log(`[AI] Interpretation completed in ${inferenceTime}ms`);

      return {
        narrative,
        recommendations: microTasks,
        confidence,
        modelVersion: '1.0.0-rule-based',
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[AI] Interpretation failed:', error);
      return {
        narrative:
          'Energi Anda menunjukkan potensi besar untuk pertumbuhan. Fokus pada keseimbangan dan harmoni dalam setiap aspek hidup Anda.',
        recommendations: this.generateMicroTasks(matrix),
        confidence: 0.6,
        modelVersion: '1.0.0-rule-based',
        generatedAt: new Date().toISOString(),
      };
    }
  }

  private generateMicroTasks(matrix: EnergyMatrix): MicroTask[] {
    const tasks: MicroTask[] = [];
    const today = new Date().toISOString();

    const patterns = {
      isNewBeginning: matrix.matrix.personalDay === 1,
      isIntrospection: matrix.matrix.personalDay === 7,
      isCommunication: matrix.matrix.personalDay === 3,
      isAction: matrix.matrix.personalDay === 8,
      isLove: matrix.matrix.personalDay === 6,
      isSpiritual: matrix.arkana.element === 'Water',
      isCreative: matrix.matrix.expression > 5,
      isLeadership: matrix.matrix.lifePath === 1 || matrix.matrix.lifePath === 8,
    };

    if (patterns.isNewBeginning) {
      tasks.push({
        id: `task-${Date.now()}-1`,
        type: 'career',
        action: 'Mulai proyek baru atau inisiatif',
        description:
          'Hari ini energi baru mendukung awal yang segar. Ambil langkah pertama pada ide yang sudah lama Anda pikirkan.',
        duration: '30-60 menit',
        priority: 'high',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isIntrospection) {
      tasks.push({
        id: `task-${Date.now()}-2`,
        type: 'spiritual',
        action: 'Meditasi atau journaling',
        description: 'Luangkan waktu untuk merenung dan mendengarkan suara batin Anda.',
        duration: '15-30 menit',
        priority: 'high',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isCommunication) {
      tasks.push({
        id: `task-${Date.now()}-3`,
        type: 'social',
        action: 'Hubungi seseorang yang penting',
        description: 'Energi komunikasi Anda tinggi. Gunakan untuk memperbaiki hubungan.',
        duration: '20 menit',
        priority: 'medium',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isAction) {
      tasks.push({
        id: `task-${Date.now()}-4`,
        type: 'finance',
        action: 'Review keuangan dan setujui anggaran',
        description: 'Energi pragmatis mendukung pengambilan keputusan finansial.',
        duration: '45 menit',
        priority: 'medium',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isLove) {
      tasks.push({
        id: `task-${Date.now()}-5`,
        type: 'love',
        action: 'Luangkan waktu bersama orang terkasih',
        description: 'Energi cinta dan harmoni memuncak.',
        duration: '1-2 jam',
        priority: 'medium',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isSpiritual) {
      tasks.push({
        id: `task-${Date.now()}-6`,
        type: 'spiritual',
        action: 'Baca atau pelajari ajaran spiritual',
        description: 'Panggilan spiritual Anda kuat.',
        duration: '30 menit',
        priority: 'low',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isCreative) {
      tasks.push({
        id: `task-${Date.now()}-7`,
        type: 'career',
        action: 'Ekspresikan kreativitas Anda',
        description: 'Energi kreatif Anda melimpah.',
        duration: '45 menit',
        priority: 'medium',
        completed: false,
        createdAt: today,
      });
    }

    if (patterns.isLeadership) {
      tasks.push({
        id: `task-${Date.now()}-8`,
        type: 'career',
        action: 'Ambil inisiatif kepemimpinan',
        description: 'Kemampuan kepemimpinan Anda kuat hari ini.',
        duration: '1 jam',
        priority: 'high',
        completed: false,
        createdAt: today,
      });
    }

    // Health task (always included)
    tasks.push({
      id: `task-${Date.now()}-health`,
      type: 'health',
      action: 'Olahraga ringan atau jalan kaki',
      description: 'Jaga keseimbangan energi dengan aktivitas fisik.',
      duration: '20-30 menit',
      priority: 'medium',
      completed: false,
      createdAt: today,
    });

    return tasks.slice(0, 5);
  }
}

// Singleton instance
let defaultAI: NumerologyAI | null = null;

export function getAI(): NumerologyAI {
  if (!defaultAI) {
    defaultAI = new NumerologyAI();
  }
  return defaultAI;
}

export function resetAI(): void {
  defaultAI = null;
}
 