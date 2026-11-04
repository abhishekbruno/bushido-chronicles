
import React from 'react';

/**
 * Bushido Chronicles — Creator Watermark
 *
 * A subtle Japanese-inspired artist signature.
 * Designed and developed by Abhishek Bruno.
 */

export default function CreatorWatermark() {
    return (
        <div
            className="bc-creator-watermark"
            aria-hidden="true"
        >
            {/* Creator signature */}
            <div className="bc-creator-watermark-text">
                <span>CRAFTED BY</span>

                <strong>
                    ABHISHEK BRUNO
                </strong>
            </div>

            {/* Japanese-inspired crimson hanko seal */}
            <span className="bc-creator-watermark-seal">
                AB
            </span>
        </div>
    );
}
