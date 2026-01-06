/**
 * AI Moderation Service (SF-003)
 *
 * Handles content moderation for food posts including:
 * - Food image verification
 * - Community guidelines compliance
 * - Spam detection
 * - Inappropriate content filtering
 */

// Moderation Status
export type ModerationStatus = 'pending' | 'approved' | 'flagged' | 'rejected' | 'manual_review';

// Flag Types
export type ModerationFlagType =
    | 'not_food'
    | 'inappropriate'
    | 'spam'
    | 'misleading'
    | 'copyright'
    | 'personal_info'
    | 'violence'
    | 'hate_speech'
    | 'commercial';

export interface ModerationFlag {
    type: ModerationFlagType;
    confidence: number; // 0-1
    description: string;
    detectedAt: Date;
}

export interface ModerationResult {
    postId: string;
    status: ModerationStatus;
    flags: ModerationFlag[];
    overallConfidence: number;
    humanReviewRequired: boolean;
    processedAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    notes?: string;
}

export interface ContentAnalysis {
    isFoodImage: boolean;
    foodConfidence: number;
    detectedItems: string[];
    nutritionEstimate?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

export interface TextAnalysis {
    sentiment: 'positive' | 'neutral' | 'negative';
    toxicity: number; // 0-1
    spam: number; // 0-1
    categories: string[];
}

// Thresholds
const THRESHOLDS = {
    autoApprove: 0.95,      // Auto-approve if confidence >= 95%
    autoReject: 0.9,        // Auto-reject if flag confidence >= 90%
    foodConfidence: 0.7,    // Minimum food detection confidence
    manualReview: 0.6,      // Manual review if confidence between 60-90%
    toxicity: 0.7,          // Flag if toxicity >= 70%
    spam: 0.8,              // Flag if spam score >= 80%
} as const;

// Main Moderation Functions
export async function moderatePost(
    postId: string,
    imageUrl?: string,
    textContent?: string
): Promise<ModerationResult> {
    const flags: ModerationFlag[] = [];
    let overallConfidence = 1.0;

    // Analyze image if provided
    if (imageUrl) {
        const imageAnalysis = await analyzeImage(imageUrl);

        if (!imageAnalysis.isFoodImage && imageAnalysis.foodConfidence < THRESHOLDS.foodConfidence) {
            flags.push({
                type: 'not_food',
                confidence: 1 - imageAnalysis.foodConfidence,
                description: '음식 이미지가 아닌 것으로 감지됨',
                detectedAt: new Date(),
            });
            overallConfidence *= imageAnalysis.foodConfidence;
        }
    }

    // Analyze text if provided
    if (textContent) {
        const textAnalysis = await analyzeText(textContent);

        if (textAnalysis.toxicity >= THRESHOLDS.toxicity) {
            flags.push({
                type: 'inappropriate',
                confidence: textAnalysis.toxicity,
                description: '부적절한 언어 사용 감지',
                detectedAt: new Date(),
            });
            overallConfidence *= (1 - textAnalysis.toxicity);
        }

        if (textAnalysis.spam >= THRESHOLDS.spam) {
            flags.push({
                type: 'spam',
                confidence: textAnalysis.spam,
                description: '스팸성 콘텐츠 감지',
                detectedAt: new Date(),
            });
            overallConfidence *= (1 - textAnalysis.spam);
        }
    }

    // Determine status
    let status: ModerationStatus;
    let humanReviewRequired = false;

    if (flags.length === 0 && overallConfidence >= THRESHOLDS.autoApprove) {
        status = 'approved';
    } else if (flags.some(f => f.confidence >= THRESHOLDS.autoReject)) {
        status = 'rejected';
    } else if (flags.length > 0 || overallConfidence < THRESHOLDS.autoApprove) {
        status = 'manual_review';
        humanReviewRequired = true;
    } else {
        status = 'approved';
    }

    return {
        postId,
        status,
        flags,
        overallConfidence,
        humanReviewRequired,
        processedAt: new Date(),
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function analyzeImage(_imageUrl: string): Promise<ContentAnalysis> {
    // Mock AI image analysis - would use actual ML model
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simulate food detection (in real implementation, use Vision API)
    const isFoodImage = Math.random() > 0.1; // 90% of images are food
    const foodConfidence = isFoodImage ? 0.85 + Math.random() * 0.15 : Math.random() * 0.5;

    return {
        isFoodImage,
        foodConfidence,
        detectedItems: isFoodImage ? ['rice', 'vegetables', 'protein'] : [],
        nutritionEstimate: isFoodImage ? {
            calories: Math.floor(300 + Math.random() * 400),
            protein: Math.floor(15 + Math.random() * 25),
            carbs: Math.floor(30 + Math.random() * 40),
            fat: Math.floor(10 + Math.random() * 20),
        } : undefined,
    };
}

export async function analyzeText(text: string): Promise<TextAnalysis> {
    // Mock text analysis - would use NLP model
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simple heuristic checks (in real implementation, use NLP API)
    const lowercaseText = text.toLowerCase();

    // Check for spam patterns
    const spamPatterns = ['광고', '홍보', '구매', '클릭', '무료', 'http', 'www'];
    const spamScore = spamPatterns.filter(p => lowercaseText.includes(p)).length / spamPatterns.length;

    // Check for toxic patterns (simplified)
    const toxicPatterns = ['욕설1', '욕설2']; // Would use actual toxic word list
    const toxicityScore = toxicPatterns.filter(p => lowercaseText.includes(p)).length / 10;

    return {
        sentiment: 'positive',
        toxicity: Math.min(toxicityScore, 1),
        spam: Math.min(spamScore, 1),
        categories: ['food', 'lifestyle'],
    };
}

export async function reportContent(
    postId: string,
    reporterId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _reason: ModerationFlagType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _description?: string
): Promise<{ reportId: string; success: boolean }> {
    // Create user report
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Queue for manual review
    console.log(`Report created: ${reportId} for post ${postId} by ${reporterId}`);

    return {
        reportId,
        success: true,
    };
}

export async function reviewModeration(
    postId: string,
    reviewerId: string,
    decision: 'approve' | 'reject',
    notes?: string
): Promise<ModerationResult> {
    return {
        postId,
        status: decision === 'approve' ? 'approved' : 'rejected',
        flags: [],
        overallConfidence: 1.0,
        humanReviewRequired: false,
        processedAt: new Date(),
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        notes,
    };
}

// Export service
export const moderationService = {
    moderatePost,
    analyzeImage,
    analyzeText,
    reportContent,
    reviewModeration,
    THRESHOLDS,
};

export default moderationService;
