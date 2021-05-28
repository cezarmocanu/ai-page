import {useRef, useEffect, useState} from 'react';

const DEFAULT_HANDLERS = {
    mouseMove: () => {}
};

// ES6 code
function throttled(delay, fn) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date()).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

const useCanvas = (draw, handlers = DEFAULT_HANDLERS) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const throttledHandlers = Object.keys(handlers).reduce((acc, key) => ({...acc, [key]: throttled(32, handlers[key])}),{})
        Object.keys(throttledHandlers).forEach(key => {
            canvas[`on${key}`] = throttledHandlers[key];
        });

        const ctx = canvas.getContext('2d');

        let frameCount = 0;
        let animationFrameId;

        const render = () => {
            frameCount++;
            draw(ctx, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw, handlers]);

    return canvasRef;
}

export default useCanvas;
