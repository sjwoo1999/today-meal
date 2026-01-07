/**
 * 딥링크 및 구매 링크 생성 유틸리티
 */

import { getStoreById, type Store } from './productDatabase';

// 딥링크 결과 타입
export interface DeepLinkResult {
    appLink: string | null;
    webLink: string;
    storeInfo: Store | null;
}

/**
 * 특정 상품의 딥링크 생성
 */
export function generateProductDeepLink(
    storeId: string,
    productId?: string,
    productUrl?: string
): DeepLinkResult {
    const store = getStoreById(storeId);

    if (!store) {
        return {
            appLink: null,
            webLink: '#',
            storeInfo: null
        };
    }

    // 직접 URL이 있으면 사용
    if (productUrl) {
        return {
            appLink: store.appScheme ? `${store.appScheme}product/${productId}` : null,
            webLink: productUrl,
            storeInfo: store
        };
    }

    // 스토어별 딥링크 패턴
    const appLink = store.appScheme
        ? `${store.appScheme}${productId ? `product/${productId}` : ''}`
        : null;

    return {
        appLink,
        webLink: store.webUrl,
        storeInfo: store
    };
}

/**
 * 스토어 앱 열기 시도 (웹 폴백)
 */
export function openStoreApp(storeId: string, productId?: string): void {
    if (typeof window === 'undefined') return;

    const result = generateProductDeepLink(storeId, productId);

    if (result.appLink) {
        // 앱 열기 시도
        const timeout = setTimeout(() => {
            // 앱이 없으면 웹으로 이동
            window.location.href = result.webLink;
        }, 1500);

        // 앱 스킴으로 이동
        window.location.href = result.appLink;

        // 페이지 숨김(앱 열림) 감지하여 타임아웃 취소
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearTimeout(timeout);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
    } else {
        // 앱 스킴 없으면 바로 웹으로
        window.location.href = result.webLink;
    }
}

/**
 * 쿠팡 파트너스 링크 생성 (예시)
 */
export function generateCoupangAffiliateLink(productUrl: string): string {
    // 실제 구현시 쿠팡 파트너스 API 사용
    const affiliateId = process.env.NEXT_PUBLIC_COUPANG_AFFILIATE_ID || 'AF1234567';
    const separator = productUrl.includes('?') ? '&' : '?';
    return `${productUrl}${separator}src=affiliate&af_id=${affiliateId}`;
}

/**
 * 여러 스토어 가격 비교 링크 생성
 */
export function generatePriceComparisonLinks(
    productName: string
): { store: string; searchUrl: string }[] {
    const encodedName = encodeURIComponent(productName);

    return [
        {
            store: 'coupang',
            searchUrl: `https://www.coupang.com/np/search?q=${encodedName}`
        },
        {
            store: 'kurly',
            searchUrl: `https://www.kurly.com/search?sword=${encodedName}`
        },
        {
            store: 'naver',
            searchUrl: `https://search.shopping.naver.com/search/all?query=${encodedName}`
        },
        {
            store: 'ssg',
            searchUrl: `https://www.ssg.com/search.ssg?target=all&query=${encodedName}`
        }
    ];
}

/**
 * 카카오톡 공유하기 링크 생성
 */
export function generateKakaoShareLink(
    productName: string,
    productImage?: string,
    productUrl?: string
): object {
    return {
        objectType: 'feed',
        content: {
            title: productName,
            description: '오늘한끼에서 추천하는 건강식품',
            imageUrl: productImage || '/images/default-product.jpg',
            link: {
                webUrl: productUrl || 'https://todayhanki.com',
                mobileWebUrl: productUrl || 'https://todayhanki.com'
            }
        },
        buttons: [
            {
                title: '구매하기',
                link: {
                    webUrl: productUrl || 'https://todayhanki.com',
                    mobileWebUrl: productUrl || 'https://todayhanki.com'
                }
            }
        ]
    };
}

/**
 * 클립보드에 링크 복사
 */
export async function copyLinkToClipboard(url: string): Promise<boolean> {
    if (typeof navigator === 'undefined') return false;

    try {
        await navigator.clipboard.writeText(url);
        return true;
    } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            return true;
        } catch {
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}
