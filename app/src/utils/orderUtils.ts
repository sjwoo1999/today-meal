/**
 * 배달앱 주문 연동 유틸리티
 * MVP에서는 딥링크 방식으로 구현
 */

// 배달앱 타입
export type DeliveryApp = 'baemin' | 'yogiyo' | 'coupangeats';

// 식당 정보
export interface RestaurantInfo {
    name: string;
    baeminId?: string;
    yogiyoId?: string;
    coupangeatsId?: string;
}

// 메뉴 정보
export interface MenuInfo {
    name: string;
    restaurant: RestaurantInfo;
    price?: number;
}

/**
 * 배달앱 딥링크 생성
 * @param app 배달앱 종류
 * @param restaurantId 식당 ID (앱별 상이)
 * @returns 딥링크 URL
 */
export function generateDeepLink(app: DeliveryApp, restaurantId?: string): string {
    switch (app) {
        case 'baemin':
            // 배민 앱으로 이동 (식당 페이지 or 메인)
            if (restaurantId) {
                return `baemin://shop?shopId=${restaurantId}`;
            }
            return 'baemin://';

        case 'yogiyo':
            // 요기요 앱으로 이동
            if (restaurantId) {
                return `yogiyo://store/${restaurantId}`;
            }
            return 'yogiyo://';

        case 'coupangeats':
            // 쿠팡이츠 앱으로 이동
            if (restaurantId) {
                return `coupangeats://store/${restaurantId}`;
            }
            return 'coupangeats://';

        default:
            return '';
    }
}

/**
 * 웹 폴백 URL 생성 (앱이 없을 경우)
 */
export function generateWebFallback(app: DeliveryApp, searchQuery?: string): string {
    const encodedQuery = searchQuery ? encodeURIComponent(searchQuery) : '';

    switch (app) {
        case 'baemin':
            return searchQuery
                ? `https://www.baemin.com/search?query=${encodedQuery}`
                : 'https://www.baemin.com';

        case 'yogiyo':
            return searchQuery
                ? `https://www.yogiyo.co.kr/mobile/#/search/${encodedQuery}`
                : 'https://www.yogiyo.co.kr';

        case 'coupangeats':
            return 'https://www.coupangeats.com';

        default:
            return '';
    }
}

/**
 * 주문 버튼 클릭 핸들러
 * 딥링크 시도 후 실패 시 웹으로 폴백
 */
export function handleOrderClick(
    app: DeliveryApp,
    restaurantId?: string,
    searchQuery?: string
): void {
    const deepLink = generateDeepLink(app, restaurantId);
    const webFallback = generateWebFallback(app, searchQuery);

    // 모바일인지 확인
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && deepLink) {
        // 딥링크 시도
        const startTime = Date.now();

        window.location.href = deepLink;

        // 앱이 열리지 않으면 웹으로 폴백 (2초 후)
        setTimeout(() => {
            // 페이지가 아직 보이면 앱이 열리지 않은 것
            if (Date.now() - startTime < 2500) {
                window.open(webFallback, '_blank');
            }
        }, 2000);
    } else {
        // PC에서는 웹으로 직접 이동
        window.open(webFallback, '_blank');
    }
}

/**
 * 배달앱 정보
 */
export const DELIVERY_APPS: Record<DeliveryApp, { name: string; nameKr: string; icon: string; color: string }> = {
    baemin: {
        name: 'Baemin',
        nameKr: '배달의민족',
        icon: '🛵',
        color: '#2AC1BC',
    },
    yogiyo: {
        name: 'Yogiyo',
        nameKr: '요기요',
        icon: '🍽️',
        color: '#FA0050',
    },
    coupangeats: {
        name: 'Coupang Eats',
        nameKr: '쿠팡이츠',
        icon: '🚀',
        color: '#FC5F08',
    },
};

/**
 * 알림 예약 (로컬 스토리지 기반 MVP)
 */
export function scheduleOrderReminder(
    mealType: 'breakfast' | 'lunch' | 'dinner',
    menuName: string,
    reminderTime: Date
): void {
    const reminders = JSON.parse(localStorage.getItem('orderReminders') || '[]');

    reminders.push({
        id: `reminder_${Date.now()}`,
        mealType,
        menuName,
        reminderTime: reminderTime.toISOString(),
        isNotified: false,
    });

    localStorage.setItem('orderReminders', JSON.stringify(reminders));
}

interface OrderReminder {
    id: string;
    mealType: string;
    menuName: string;
    reminderTime: string;
    isNotified: boolean;
}

/**
 * 알림 확인
 */
export function checkPendingReminders(): { id: string; menuName: string; mealType: string }[] {
    const reminders: OrderReminder[] = JSON.parse(localStorage.getItem('orderReminders') || '[]');
    const now = new Date();

    return reminders.filter((r) => {
        const reminderTime = new Date(r.reminderTime);
        return !r.isNotified && reminderTime <= now;
    });
}

/**
 * 알림 처리 완료 마킹
 */
export function markReminderAsNotified(reminderId: string): void {
    const reminders: OrderReminder[] = JSON.parse(localStorage.getItem('orderReminders') || '[]');

    const updated = reminders.map((r) =>
        r.id === reminderId ? { ...r, isNotified: true } : r
    );

    localStorage.setItem('orderReminders', JSON.stringify(updated));
}
