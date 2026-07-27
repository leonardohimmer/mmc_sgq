"use client";

import React from "react";

export function SkeletonEnsaioCard() {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm animate-pulse space-y-4">
            <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-28"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16"></div>
            </div>
            <div className="space-y-2">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonEnsaioCard key={index} />
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-12 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800"></div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between gap-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
