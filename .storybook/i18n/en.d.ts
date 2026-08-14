import { type DataTableLabels } from '../../src/components/DataTable/DataTable';
import { type DropzoneLabels } from '../../src/components/Dropzone/Dropzone';
import { type ScoreGaugeStatusLabels } from '../../src/components/ScoreGauge/ScoreGauge';
export interface ComponentLabels {
    dropzone: DropzoneLabels;
    dataTable: DataTableLabels;
    gaugeStatus: ScoreGaugeStatusLabels;
    modalClose: string;
    toastClose: string;
    toastRegion: string;
    pricingIncluded: string;
    pricingExcluded: string;
    pricingFeatures: (planTitle: string) => string;
}
export declare const en: {
    components: ComponentLabels;
    docs: {
        sections: {
            pillars: {
                kicker: string;
                title: string;
            };
            catalog: {
                kicker: string;
                title: string;
            };
            quickStart: {
                kicker: string;
                title: string;
            };
            governance: {
                kicker: string;
                title: string;
            };
            brandColors: {
                kicker: string;
                title: string;
            };
            semanticTokens: {
                kicker: string;
                title: string;
            };
            radii: {
                kicker: string;
                title: string;
            };
            typography: {
                kicker: string;
                title: string;
            };
            focus: {
                kicker: string;
                title: string;
            };
            viewports: {
                kicker: string;
                title: string;
            };
            tokenUsage: {
                kicker: string;
                title: string;
            };
        };
        introduction: {
            heroKicker: string;
            heroDescription: string;
            chips: {
                typescript: string;
                wcag: string;
                preset: string;
                storybook: string;
            };
            pillars: {
                accessibility: {
                    title: string;
                    body: string;
                };
                domain: {
                    title: string;
                    body: string;
                };
                dx: {
                    title: string;
                    body: string;
                };
            };
            families: {
                actions: string;
                forms: string;
                feedback: string;
                dataDisplay: string;
                surfaces: string;
                templates: string;
            };
            catalogIntro: string;
            composablePatterns: string;
            compoundIntro: string;
            sharedUtilities: string;
            steps: {
                install: string;
                peerDependencies: string;
                configureTailwind: string;
                presetIntro: string;
                esmEquivalent: string;
                importComponents: string;
                developLocally: string;
            };
            governance: {
                axis: string;
                practice: string;
                accessibility: string;
                accessibilityBody: string;
                interactions: string;
                interactionsBody: string;
                viewports: string;
                viewportsBody: string;
                typing: string;
                typingBody: string;
            };
            tokensNote: string;
        };
        tokens: {
            heroKicker: string;
            heroTitle: string;
            heroDescription: string;
            brandIntro: string;
            scaleUsage: {
                brand: string;
                ai: string;
            };
            roles: {
                accent: string;
                action: string;
                aaText: string;
            };
            semanticIntro: string;
            semanticNote: string;
            semanticGroups: {
                success: {
                    label: string;
                    usage: string;
                };
                error: {
                    label: string;
                    usage: string;
                };
                warning: {
                    label: string;
                    usage: string;
                };
                info: {
                    label: string;
                    usage: string;
                };
            };
            neutral: {
                token: string;
                value: string;
                usage: string;
                muted: string;
                subtle: string;
            };
            radii: string;
            elevations: string;
            typeScale: string;
            typeScaleSubtitle: string;
            typeSample: string;
            typeUsage: {
                xs: string;
                sm: string;
                base: string;
                lg: string;
                xl: string;
                xl2: string;
                xl3: string;
            };
            focusRings: string;
            focusIntro: string;
            focusNote: string;
            focusVariants: {
                standard: string;
                destructive: string;
                quiet: string;
            };
            viewportsTitle: string;
            pinViewport: string;
            pinViewportNote: string;
            shortcuts: string;
            presetHeading: string;
            presetIntro: string;
            presetNote: string;
            outsideHeading: string;
            outsideIntro: string;
            outsideNote: string;
        };
    };
    common: {
        cancel: string;
        confirm: string;
        close: string;
        save: string;
        viewDetails: string;
        download: string;
        upgrade: string;
        freePlan: string;
        today: string;
    };
    button: {
        primary: string;
        ai: string;
        loading: string;
        disabled: string;
        secondary: string;
        outline: string;
        ghost: string;
        submit: string;
    };
    badge: {
        inStock: string;
        lowStock: string;
        outOfStock: string;
        aiSuggested: string;
        draft: string;
        ok: string;
        error: string;
        warning: string;
        neutral: string;
        ai: string;
    };
    card: {
        report: {
            title: string;
            subtitle: string;
            badge: string;
            body: string;
            meta: string;
            action: string;
        };
        ai: {
            title: string;
            subtitle: string;
            body: string;
            confidence: string;
            action: string;
        };
        plan: {
            title: string;
            subtitle: string;
            body: string;
        };
        tip: {
            title: string;
            body: string;
        };
        section: {
            title: string;
            subtitle: string;
            body: string;
        };
        minimal: {
            title: string;
            body: string;
        };
    };
    input: {
        workspace: {
            label: string;
            placeholder: string;
            value: string;
        };
        email: {
            label: string;
            placeholder: string;
            error: string;
        };
        password: {
            label: string;
            helper: string;
        };
        search: {
            label: string;
            placeholder: string;
        };
    };
    textarea: {
        description: {
            label: string;
            placeholder: string;
            helper: string;
            error: string;
            value: string;
        };
        note: {
            label: string;
            helper: string;
        };
    };
    segmented: {
        period: {
            label: string;
            week: string;
            month: string;
            quarter: string;
        };
        view: {
            label: string;
            grid: string;
            list: string;
        };
        workspace: {
            label: string;
            candidate: string;
            recruiter: string;
            active: string;
        };
    };
    progress: {
        storage: {
            label: string;
            unit: string;
        };
        credits: {
            label: string;
            helper: string;
            helperNearLimit: string;
            action: string;
        };
        seats: {
            label: string;
        };
        undefined: {
            label: string;
        };
        processing: string;
    };
    gauge: {
        performance: string;
        quality: string;
        health: string;
        match: string;
    };
    table: {
        columns: {
            name: string;
            category: string;
            status: string;
            price: string;
            updated: string;
            action: string;
            empty: string;
        };
        categories: {
            audio: string;
            accessories: string;
            displays: string;
        };
        statuses: {
            active: string;
            review: string;
            archived: string;
        };
        rowAction: string;
        emptyMessage: string;
    };
    modal: {
        report: {
            trigger: string;
            title: string;
            intro: string;
            campaign: string;
            checklist: string;
            items: {
                deliverability: string;
                formatting: string;
                links: string;
                images: string;
            };
            secondary: string;
            primary: string;
        };
        confirm: {
            title: string;
            body: string;
        };
        overlay: {
            title: string;
            body: string;
        };
        keyboard: {
            title: string;
            body: string;
            cancel: string;
            submit: string;
        };
        untitled: {
            ariaLabel: string;
            body: string;
        };
        headerClose: {
            title: string;
            body: string;
        };
        noFocusable: {
            ariaLabel: string;
            body: string;
        };
        compound: {
            title: string;
            body: string;
            confirm: string;
        };
    };
    pricing: {
        starter: {
            title: string;
            description: string;
            price: string;
            button: string;
            badge: string;
            features: {
                projects: string;
                history: string;
                exports: string;
                api: string;
                sso: string;
            };
        };
        growth: {
            title: string;
            description: string;
            price: string;
            button: string;
            features: {
                everything: string;
                automation: string;
                roles: string;
                seats: string;
                support: string;
            };
        };
        free: {
            title: string;
            description: string;
            price: string;
            button: string;
            feature: string;
        };
        enterprise: {
            title: string;
            description: string;
            price: string;
            period: string;
            feature: string;
        };
        select: {
            title: string;
            description: string;
            button: string;
            feature: string;
        };
        period: string;
        heading: string;
    };
    toast: {
        success: {
            title: string;
            description: string;
        };
        ai: {
            title: string;
            description: string;
        };
        warning: {
            title: string;
            description: string;
        };
        error: {
            title: string;
            description: string;
        };
        info: {
            title: string;
            description: string;
        };
        titleOnly: {
            title: string;
        };
        dismissed: string;
        queue: {
            trigger: string;
            title: string;
            description: string;
        };
    };
    dropzone: {
        single: string;
        multiple: string;
    };
    dashboard: {
        workspaceLabel: string;
        statuses: {
            matched: string;
            review: string;
            rejected: string;
        };
        candidate: {
            brand: string;
            title: string;
            analysis: {
                title: string;
                subtitle: string;
                resumeLabel: string;
                company: {
                    label: string;
                    placeholder: string;
                    value: string;
                };
                job: {
                    label: string;
                    placeholder: string;
                    value: string;
                };
                description: {
                    label: string;
                    placeholder: string;
                    helper: string;
                    value: string;
                };
                cta: string;
            };
            advice: {
                title: string;
                subtitle: string;
                badge: string;
                body: string;
                meta: string;
                action: string;
            };
            score: {
                label: string;
                status: string;
            };
            quota: {
                title: string;
                label: string;
                unit: string;
                helper: string;
                action: string;
            };
            history: {
                title: string;
                subtitle: string;
                columns: {
                    position: string;
                    score: string;
                    status: string;
                    date: string;
                    action: string;
                };
                action: string;
            };
        };
        recruiter: {
            brand: string;
            title: string;
            kpi: {
                matchLabel: string;
                matchCaption: string;
                compatible: string;
                toReview: string;
            };
            upload: {
                title: string;
                subtitle: string;
            };
            history: {
                title: string;
                subtitle: string;
                columns: {
                    candidate: string;
                    job: string;
                    score: string;
                    status: string;
                    date: string;
                    action: string;
                };
                action: string;
            };
        };
    };
};
//# sourceMappingURL=en.d.ts.map