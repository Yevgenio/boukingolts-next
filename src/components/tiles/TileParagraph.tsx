'use client';
import React, { useEffect, useRef, useState } from 'react';
import './TileParagraph.css';

const paragraphs = [
  `Hey there! Wlcome to my website!</br>My name is Yevgeni Boukingolts and it's great to have you here.`,
  `The website is still under construction with pleanty of awesome features to come!`,
  `Keep in mind that some features will only become available only after user signup.`,
  `If you love what I do contact me at <a href="mailto:Yevgeni.b93@gmail.com">Yevgeni.b93@gmail.com</a>`,
];

const DURATION = 5000; // 5 seconds in ms

export default function TileParagraph() {
  const mainRef = useRef<HTMLParagraphElement>(null);
  const tilesWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false); 

  // Timer state
  const startTimeRef = useRef<number>(performance.now());
  const elapsedRef = useRef<number>(0);
  const rafRef = useRef<number>();

  // Progress bar update
  function updateProgress() {
    if (pausedRef.current) return; // use ref here
    const now = performance.now();
    const elapsed = now - startTimeRef.current + elapsedRef.current;
    const percent = Math.min((elapsed / DURATION) * 100, 100);
    if (progressRef.current) {
      progressRef.current.style.width = `${percent}%`;
    }
    if (elapsed >= DURATION) {
      goToNext();
    } else {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }

  // Start or resume timer
  function startTimer() {
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(updateProgress);
  }

  // Pause timer
  function pauseTimer() {
    setPaused(true);
    pausedRef.current = true; // <-- set ref
    elapsedRef.current += performance.now() - startTimeRef.current;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  // Resume timer
  function resumeTimer() {
    if (!pausedRef.current) return; // <-- use ref
    setPaused(false);
    pausedRef.current = false; // <-- set ref
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(updateProgress);
  }

  // Reset timer
  function resetTimer() {
    elapsedRef.current = 0;
    if (progressRef.current) progressRef.current.style.width = '0%';
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPaused(false);
    pausedRef.current = false; // <-- set ref
    startTimer();
  }

  useEffect(() => {
    resetTimer();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line
  }, [current]);

  function getDimensions() {
    const container = containerRef.current!;
    const styles = getComputedStyle(container);
    const width = parseInt(styles.width);
    const height = parseInt(styles.height);
    return {
      width,
      height,
      cols: Math.floor(width / 50),
      rows: Math.floor(height / 50),
    };
  }

  function createTransitionTiles(fromText: string, toText: string, onFinish?: () => void) {
    const wrapper = tilesWrapperRef.current!;
    const paragraph = mainRef.current!;
    const { width, height, cols, rows } = getDimensions();

    wrapper.innerHTML = '';
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    wrapper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const tileW = width / cols;
    const tileH = height / rows;

    for (let i = 0; i < cols * rows; i++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.width = `${tileW}px`;
      tile.style.height = `${tileH}px`;

      const inner = document.createElement('div');
      inner.className = 'tile-inner';

      const front = document.createElement('div');
      front.className = 'tile-face front';

      const back = document.createElement('div');
      back.className = 'tile-face back';
      back.style.transform = 'rotateY(180deg)';

      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = -col * tileW;
      const y = -row * tileH;

      const frontContent = document.createElement('div');
      frontContent.innerHTML = fromText;
      frontContent.style.transform = `translate(${x}px, ${y}px)`;

      const backContent = document.createElement('div');
      backContent.innerHTML = toText;
      backContent.style.transform = `translate(${x}px, ${y}px)`;

      front.appendChild(frontContent);
      back.appendChild(backContent);
      inner.appendChild(front);
      inner.appendChild(back);
      tile.appendChild(inner);
      wrapper.appendChild(tile);

      const delay = (col * 80) + (row * 60);
      setTimeout(() => tile.classList.add('flipped'), delay);
    }

    const maxDelay = (cols - 1) * 80 + (rows - 1) * 60 + 600;

    setTimeout(() => {
      paragraph.innerHTML = toText;
    }, maxDelay - 200);

    setTimeout(() => {
      wrapper.innerHTML = '';
      wrapper.style.display = 'none';
      onFinish?.();
    }, maxDelay);
  }

  function goToNext() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    elapsedRef.current = 0;
    if (progressRef.current) progressRef.current.style.width = '0%';
    const from = paragraphs[current];
    const next = (current + 1) % paragraphs.length;
    const to = paragraphs[next];
    createTransitionTiles(from, to, () => setCurrent(next));
  }

  function handleMouseEnter() {
    pauseTimer();
  }
  function handleMouseLeave() {
    resumeTimer();
  }

  return (
    <>
      <div
        className="paragraph-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p
          id="main-paragraph"
          ref={mainRef}
          dangerouslySetInnerHTML={{ __html: paragraphs[current] }}
        />
        <div className="tiles-wrapper" ref={tilesWrapperRef} />
        <div className="progress-bar">
          <div className="progress" ref={progressRef} />
        </div>
      </div>
    </>
  );
}
