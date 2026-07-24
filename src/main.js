/* Brand slider — full-viewport, scroll-driven vertical loop.

   Wheel / trackpad / touch scrub the stack of brand photos continuously; on
   idle it snaps to whichever brand crossed the half-screen line (with a small
   velocity bias). The stack loops forever in both directions, each photo gets
   a Y-parallax, and the glass card's copy swaps to match the centred brand.
   Mounts on #mfa-root (markup in index.html). */

import "./style.css";
import "./demo.css"; // showcase page only — do NOT copy into your project
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText); // registering twice is harmless if the host site also does

(function mfaBrands() {
  const mount = document.querySelector("#mfa-root");
  if (!mount) return;

  /* --------------------------------------------------------------------------
     CONTENT — the only block you normally edit.

     `photo` is an Unsplash id: everything after "photo-" in the image URL. Swap
     the id (or replace `photoUrl()` below with your own path) to change a slide.
     Keep `alt` in sync with the new image.
     -------------------------------------------------------------------------- */

  const BRANDS = [
    {
      name: "Meridian",
      tagline: "It starts outside.",
      claim: "The trail is for",
      highlight: "everyone",
      headline: "We exist to share the simple power of being outside.",
      about:
        "Twenty-two years of footwear built for the ground between the trailhead and the summit — tested by the people who spend every weekend out there.",
      photo: "1441974231531-c6227db76b6e",
      alt: "Sunlit dirt trail winding through a dense forest of tall trees",
      shop: "https://example.com/meridian/shop",
      jobs: "https://example.com/meridian/careers",
    },
    {
      name: "Kestrel",
      tagline: "Every street is a start line.",
      claim: "Built for the",
      highlight: "first mile",
      headline: "Fast shoes for people whose training plan is simply: go.",
      about:
        "Road racers and daily trainers developed with city runners — light enough for intervals, honest enough for a Tuesday commute.",
      photo: "1483721310020-03333e577078",
      alt: "Runner crouching to tie a shoelace on an empty city street",
      shop: "https://example.com/kestrel/shop",
      jobs: "https://example.com/kestrel/careers",
    },
    {
      name: "Northbound",
      tagline: "Above the cloud line.",
      claim: "Made for the",
      highlight: "long ascent",
      headline:
        "Technical layers tested where the weather changes its mind hourly.",
      about:
        "Shells, insulation and hardware for alpine starts — built with guides who need every zip to work with gloves on.",
      photo: "1506905925346-21bda4d32df4",
      alt: "Snow-covered mountain peaks rising above a sea of clouds at sunrise",
      shop: "https://example.com/northbound/shop",
      jobs: "https://example.com/northbound/careers",
    },
    {
      name: "Ironwood",
      tagline: "Earn the weight.",
      claim: "Nothing here is",
      highlight: "decorative",
      headline: "Training gear built to be used badly and last anyway.",
      about:
        "Belts, bars and footwear for garage gyms and shift work — overbuilt on purpose, replaced far less often.",
      photo: "1517836357463-d25dfeac3438",
      alt: "Athlete gripping a loaded barbell on wet outdoor paving",
      shop: "https://example.com/ironwood/shop",
      jobs: "https://example.com/ironwood/careers",
    },
    {
      name: "Driftway",
      tagline: "Salt first.",
      claim: "The session starts at",
      highlight: "dawn",
      headline:
        "Boardshorts and wetsuits for people who check the swell before the news.",
      about:
        "Warm-water suits and quick-dry basics shaped around long sessions and short drives to the coast.",
      photo: "1502680390469-be75c86b636f",
      alt: "Surfer riding inside the barrel of a turquoise breaking wave",
      shop: "https://example.com/driftway/shop",
      jobs: "https://example.com/driftway/careers",
    },
    {
      name: "Fieldnote",
      tagline: "Pack light. Stay longer.",
      claim: "Everything you own in",
      highlight: "one bag",
      headline: "Travel goods designed around the things you actually carry.",
      about:
        "Carry-on luggage, packing systems and jackets that survive the third connecting flight without looking like it.",
      photo: "1470071459604-3b5ec3a7fe05",
      alt: "Mist rolling over green cliffs beside a winding road at sunset",
      shop: "https://example.com/fieldnote/shop",
      jobs: "https://example.com/fieldnote/careers",
    },
    {
      name: "Cornice",
      tagline: "First chair, every time.",
      claim: "Warm is not",
      highlight: "optional",
      headline: "Mountain kit for the days that start before the lifts do.",
      about:
        "Insulated outerwear and gloves developed on resort patrol shifts, where a failed seam ends the day.",
      photo: "1551698618-1dfe5d97d256",
      alt: "Skier carving a turn down a freshly groomed sunlit slope",
      shop: "https://example.com/cornice/shop",
      jobs: "https://example.com/cornice/careers",
    },
    {
      name: "Halcyon",
      tagline: "Lane four. Lights on.",
      claim: "Where the day gets",
      highlight: "quiet",
      headline: "Swimwear engineered for the hour nobody sees you train.",
      about:
        "Chlorine-proof racing suits and goggles refined over four seasons of masters and club programmes.",
      photo: "1530549387789-4c1017266635",
      alt: "Swimmer surfacing mid-butterfly stroke in a blue competition pool",
      shop: "https://example.com/halcyon/shop",
      jobs: "https://example.com/halcyon/careers",
    },
    {
      name: "Sawtooth",
      tagline: "Hold the wheel.",
      claim: "Won in the",
      highlight: "last kilometre",
      headline: "Race kit shaped by riders who count grams and mean it.",
      about:
        "Bib shorts, jerseys and shoes tested across a full road season — nothing ships until someone has raced it.",
      photo: "1517649763962-0c623066013b",
      alt: "Tight peloton of road cyclists racing along a closed road",
      shop: "https://example.com/sawtooth/shop",
      jobs: "https://example.com/sawtooth/careers",
    },
    {
      name: "Stillwater",
      tagline: "Slow is a skill.",
      claim: "Best days are the",
      highlight: "unplanned ones",
      headline: "Easy gear for weekends measured in daylight, not distance.",
      about:
        "Swim shorts, sandals and soft goods for lake mornings, long lunches and the walk back at dusk.",
      photo: "1501785888041-af3ef285b470",
      alt: "Wooden rowing boats on a turquoise alpine lake below steep cliffs",
      shop: "https://example.com/stillwater/shop",
      jobs: "https://example.com/stillwater/careers",
    },
    {
      name: "Lumen",
      tagline: "Run after dark.",
      claim: "Seen from",
      highlight: "300 metres",
      headline: "Reflective running gear for the miles that happen after work.",
      about:
        "High-visibility layers and lighting built with winter run clubs, where being noticed is the whole product.",
      photo: "1552674605-db6ffd4facb5",
      alt: "Three runners silhouetted against a deep blue dusk sky on a road",
      shop: "https://example.com/lumen/shop",
      jobs: "https://example.com/lumen/careers",
    },
  ];

  /* --------------------------------------------------------------------------
     CONFIG — every knob in one place
     -------------------------------------------------------------------------- */

  const CFG = {
    // free-scroll feel (Lenis-style: normalised wheel + a gentle per-frame ease)
    wheelSpeed: 0.0013, // normalised px delta -> slide units
    wheelStepMax: 1.7, // cap on a single wheel event so it can't leap the stack
    lerp: 0.1, // per-frame smoothing toward the target (Lenis default ~0.1)
    // magnetic snap
    snapDelay: 140, // ms of scroll-idle before the snap fires
    snapDuration: 1, // eased settle onto the nearest brand
    snapEase: "expo.out", // Lenis-style deceleration curve
    velocityBias: 0.14, // how much a flick tips the 50% snap toward its direction
    overscroll: 0.12, // how far past the first/last brand a scroll can rubber-band
    parallax: 0.36, // image Y drift as a fraction of viewport height per slide
    imgQuality: 80, // Unsplash `q` for the full-bleed photos
    textSeconds: 0.62, // card copy settle duration
    exitSeconds: 0.26, // card copy leave duration
  };

  // one big photo on desktop, a lighter one on phones
  const stageWidth = window.innerWidth > 900 ? 1920 : 1080;
  const N = BRANDS.length;

  /* --------------------------------------------------------------------------
     Helpers
     -------------------------------------------------------------------------- */

  const el = (key, root = mount) => root.querySelector(`[data-mfa="${key}"]`);
  const wrapIndex = (i, len) => ((i % len) + len) % len;
  const pad2 = (n) => String(n).padStart(2, "0");
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const photoUrl = (id, w, q = CFG.imgQuality) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

  // every listener goes through this so destroy() can undo all of them
  const teardowns = [];
  const on = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    teardowns.push(() => target.removeEventListener(type, fn, opts));
  };

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;
  // near-zero rather than zero so onComplete callbacks still fire in order
  const D = (seconds) => (reduced ? 0.001 : seconds);

  /* --------------------------------------------------------------------------
     Elements
     -------------------------------------------------------------------------- */

  const stage = el("stage");
  const live = el("live");
  const wordmark = el("wordmark");
  const tagline = el("tagline");
  const claim = el("claim");
  const highlight = el("highlight");
  const headline = el("headline");
  const more = el("more");
  const about = el("about");
  const learnBtn = el("learn");
  const learnLabel = el("learn-label");
  const shopLink = el("shop");
  const jobsLink = el("jobs");
  const nameOut = el("name");
  const currentOut = el("current");
  const totalOut = el("total");
  const prevBtn = el("prev");
  const nextBtn = el("next");
  const viewAllBtn = el("viewall");
  const viewAllLabel = el("viewall-label");
  const sheet = el("sheet");
  const listEl = el("list");

  const tags = mount.querySelector(".mfa-brands__tags");
  const actions = mount.querySelector(".mfa-brands__actions");

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  let pos = 0; // scroll target, in slide units (unbounded; wraps visually)
  let disp = 0; // rendered position, eased toward pos each frame
  let prevDisp = 0; // last frame's disp, for direction
  let active = 0; // wrapIndex(round(disp)) — the centred brand
  let vel = 0; // smoothed input velocity, biases the snap
  let snapId = 0; // scroll-idle debounce timer
  let snapping = false; // is an eased snap tween currently driving disp?
  let snapTween = null;
  let running = false; // ticker attached?
  let inView = true;
  let lastRendered = NaN;

  let expanded = false; // "Learn more" panel
  let sheetOpen = false; // "View All" list
  let lastFocus = null; // restored when the sheet closes
  let outTl = null;
  let inTl = null;
  let headlineSplit = null;

  const slides = []; // { slide, img } per brand

  /* --------------------------------------------------------------------------
     Slide stack — one full-viewport layer per brand, positioned each frame
     -------------------------------------------------------------------------- */

  function buildSlides() {
    const frag = document.createDocumentFragment();
    BRANDS.forEach((brand, i) => {
      const slide = document.createElement("div");
      slide.className = "mfa-brands__slide";

      const img = document.createElement("img");
      img.className = "mfa-brands__img";
      img.src = photoUrl(brand.photo, stageWidth);
      img.alt = brand.alt;
      img.decoding = "async";
      // the first few matter immediately; the rest can wait
      img.loading = i <= 1 || i === N - 1 ? "eager" : "lazy";
      img.fetchPriority = i === 0 ? "high" : "auto";

      slide.appendChild(img);
      frag.appendChild(slide);
      slides.push({ slide, img });
    });
    stage.appendChild(frag);
  }

  // place every slide by its distance from `d`; near ones on-screen with a
  // lagging image (parallax), far ones parked and hidden. No wrap — the stack
  // is a finite run from the first brand to the last.
  function render(d) {
    const h = mount.clientHeight || window.innerHeight;
    const p = reduced ? 0 : CFG.parallax;

    for (let i = 0; i < N; i++) {
      const delta = i - d;

      const { slide, img } = slides[i];
      if (Math.abs(delta) <= 1.2) {
        slide.style.visibility = "visible";
        slide.style.zIndex = String(50 - Math.round(Math.abs(delta) * 10));
        slide.style.transform = `translate3d(0, ${delta * h}px, 0)`;
        img.style.transform = `translate3d(0, ${-delta * h * p}px, 0)`;
      } else if (slide.style.visibility !== "hidden") {
        slide.style.visibility = "hidden";
      }
    }
  }

  // whenever the centred brand changes, swap the card copy + counter to match
  function refreshActive() {
    const a = clamp(Math.round(disp), 0, N - 1);
    if (a === active) return;
    const dir = disp >= prevDisp ? 1 : -1;
    active = a;
    setActive(a, dir);
    markActiveRow();
  }

  function setActive(i, dir) {
    const brand = BRANDS[i];
    swapCard(brand, dir);
    rollCounter(i, dir);
    live.textContent = `${brand.name}, ${i + 1} of ${N}`;
  }

  /* --------------------------------------------------------------------------
     "View All" list — a vertical panel of every brand; a row jumps the scroll
     to that brand. Built once, on first open.
     -------------------------------------------------------------------------- */

  function buildList() {
    if (listEl.childElementCount) return;

    const frag = document.createDocumentFragment();
    BRANDS.forEach((brand, i) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "mfa-brands__row";
      row.dataset.index = String(i);
      row.setAttribute("aria-label", `Show ${brand.name}`);

      const thumb = document.createElement("span");
      thumb.className = "mfa-brands__row-thumb";
      const img = document.createElement("img");
      img.src = photoUrl(brand.photo, 480, 65);
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      thumb.appendChild(img);

      const name = document.createElement("span");
      name.className = "mfa-brands__row-name";
      name.textContent = brand.name;

      row.append(thumb, name);
      frag.appendChild(row);
    });

    listEl.appendChild(frag);
    markActiveRow();
  }

  function markActiveRow() {
    listEl.querySelectorAll(".mfa-brands__row").forEach((row, i) => {
      const on = i === active;
      row.classList.toggle("mfa-is-active", on);
      if (on) row.setAttribute("aria-current", "true");
      else row.removeAttribute("aria-current");
    });
  }

  // View All <-> Close: label + the icon crossfade are driven by aria-expanded
  function setViewAll(open) {
    viewAllBtn.setAttribute("aria-expanded", String(open));
    viewAllLabel.textContent = open ? "Close" : "View All";
    viewAllBtn.setAttribute(
      "aria-label",
      open ? "Close brand list" : "View all brands",
    );
    mount.classList.toggle("mfa-is-listing", open);
  }

  function openSheet() {
    buildList();
    lastFocus = document.activeElement;
    sheetOpen = true;
    sheet.hidden = false;
    setViewAll(true);

    gsap.fromTo(
      sheet,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: D(0.3), ease: "power2.out" },
    );
    gsap.fromTo(
      listEl.children,
      { autoAlpha: 0, x: -18 },
      {
        autoAlpha: 1,
        x: 0,
        duration: D(0.5),
        stagger: D(0.04),
        ease: "power3.out",
      },
    );

    const activeRow = listEl.children[active];
    if (activeRow) {
      activeRow.scrollIntoView({
        block: "nearest",
        behavior: reduced ? "auto" : "smooth",
      });
    }
  }

  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    setViewAll(false);

    gsap.to(sheet, {
      autoAlpha: 0,
      duration: D(0.25),
      ease: "power2.in",
      onComplete: () => {
        sheet.hidden = true;
        gsap.set(sheet, { clearProps: "opacity,visibility" });
      },
    });

    if (lastFocus && mount.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  /* --------------------------------------------------------------------------
     Card copy (unchanged behaviour: headline always visible, Learn more toggles
     the description; text animates on each brand change)
     -------------------------------------------------------------------------- */

  function revertHeadline() {
    if (!headlineSplit) return;
    headlineSplit.revert(); // unwrap so the text reflows normally on resize
    headlineSplit = null;
  }

  function killCardAnims() {
    if (outTl) outTl.kill();
    if (inTl) inTl.kill();
    revertHeadline();
  }

  function applyText(brand) {
    wordmark.textContent = brand.name;
    const dot = document.createElement("i");
    dot.textContent = ".";
    wordmark.appendChild(dot);

    tagline.textContent = brand.tagline;
    claim.textContent = brand.claim;
    highlight.textContent = brand.highlight;
    headline.textContent = brand.headline;
    about.textContent = brand.about;
    shopLink.href = brand.shop;
    jobsLink.href = brand.jobs;
    shopLink.setAttribute("aria-label", `Shop ${brand.name}`);
    jobsLink.setAttribute("aria-label", `Job opportunities at ${brand.name}`);
    nameOut.textContent = brand.name;
  }

  function animateIn(dir) {
    headlineSplit = new SplitText(headline, { type: "lines", mask: "lines" });
    // the exit tween left the headline element hidden and y-offset; restore it
    // so the freshly split lines are actually visible as they slide up
    gsap.set(headline, { autoAlpha: 1, y: 0 });

    inTl = gsap.timeline();
    inTl
      .fromTo(
        headlineSplit.lines,
        { yPercent: 110 * dir },
        {
          yPercent: 0,
          duration: D(CFG.textSeconds),
          stagger: D(0.06),
          ease: "power3.out",
          onComplete: revertHeadline,
        },
        0,
      )
      .fromTo(
        tags,
        { autoAlpha: 0, y: 14 * dir },
        { autoAlpha: 1, y: 0, duration: D(0.45), ease: "power2.out" },
        0.04,
      )
      .fromTo(
        actions,
        { autoAlpha: 0, y: 16 * dir },
        { autoAlpha: 1, y: 0, duration: D(0.5), ease: "power2.out" },
        0.12,
      )
      .fromTo(
        wordmark,
        { autoAlpha: 0, y: 10 * dir, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: D(0.55),
          ease: "power2.out",
        },
        0,
      );
  }

  function swapCard(brand, dir) {
    killCardAnims();
    if (expanded) setExpanded(false);

    outTl = gsap.timeline({
      onComplete: () => {
        applyText(brand);
        animateIn(dir);
      },
    });
    outTl
      .to(
        [tags, headline, actions],
        {
          autoAlpha: 0,
          y: -14 * dir,
          duration: D(CFG.exitSeconds),
          stagger: D(0.03),
          ease: "power2.in",
        },
        0,
      )
      .to(
        wordmark,
        {
          autoAlpha: 0,
          y: -8 * dir,
          filter: "blur(6px)",
          duration: D(CFG.exitSeconds),
          ease: "power2.in",
        },
        0,
      );
  }

  function setExpanded(next) {
    expanded = next;
    learnBtn.setAttribute("aria-expanded", String(next));
    learnLabel.textContent = next ? "Close" : "Learn more";
    gsap.killTweensOf(more);
    gsap.to(more, {
      height: next ? "auto" : 0,
      duration: D(0.45),
      ease: "power3.inOut",
    });
  }

  function rollCounter(n, dir) {
    gsap.killTweensOf(currentOut);
    gsap
      .timeline()
      .to(currentOut, {
        yPercent: -110 * dir,
        autoAlpha: 0,
        duration: D(0.18),
        ease: "power2.in",
      })
      .add(() => {
        currentOut.textContent = pad2(n + 1);
      })
      .fromTo(
        currentOut,
        { yPercent: 110 * dir, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: D(0.3), ease: "power2.out" },
      );
  }

  /* --------------------------------------------------------------------------
     Scroll engine — a per-frame ease toward `pos`, plus an idle snap that
     resolves to whichever slide crossed the half-screen line
     -------------------------------------------------------------------------- */

  function tick() {
    // free scroll: ease disp toward the target. While a snap tween owns disp it
    // writes disp itself, so the lerp steps aside.
    if (!snapping) {
      const d = pos - disp;
      if (Math.abs(d) < 0.00006) disp = pos;
      else disp += d * CFG.lerp;
    }

    if (disp !== lastRendered) {
      render(disp);
      refreshActive();
      prevDisp = disp;
      lastRendered = disp;
    }
  }

  function setRunning(next) {
    if (next && !running) {
      gsap.ticker.add(tick);
      running = true;
    } else if (!next && running) {
      gsap.ticker.remove(tick);
      running = false;
    }
  }

  // wheels report deltas in pixels / lines / pages — fold them to a common
  // pixel-ish scale so trackpad and mouse feel the same
  function normalizeWheel(e) {
    let d = e.deltaY;
    if (e.deltaMode === 1)
      d *= 16; // lines -> px
    else if (e.deltaMode === 2) d *= mount.clientHeight || window.innerHeight;
    return d;
  }

  // keep the scroll target inside the run, with a little give past the ends
  const bound = (p) => clamp(p, -CFG.overscroll, N - 1 + CFG.overscroll);

  // magnetic settle onto the nearest brand: round() is the exact 50% rule; the
  // velocity term lets a flick tip a barely-past-half scrub the way it was
  // going, and the eased tween gives the Lenis-like deceleration. dest is clamped
  // to a real brand so the rubber-band always resolves back inside the run.
  function snap() {
    const dest = clamp(
      Math.round(pos + clamp(vel * CFG.velocityBias, -0.49, 0.49)),
      0,
      N - 1,
    );
    pos = dest;
    vel = 0;
    if (snapTween) snapTween.kill();
    snapping = true;
    const proxy = { v: disp };
    snapTween = gsap.to(proxy, {
      v: dest,
      duration: D(CFG.snapDuration),
      ease: CFG.snapEase,
      onUpdate: () => {
        disp = proxy.v;
      },
      onComplete: () => {
        snapping = false;
        snapTween = null;
      },
    });
  }

  function scheduleSnap() {
    clearTimeout(snapId);
    snapId = window.setTimeout(snap, CFG.snapDelay);
  }

  // any fresh input interrupts an in-flight snap and hands control back to the
  // free-scroll lerp, resuming from exactly where the snap had reached
  function cancelSnap() {
    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }
    if (snapping) {
      snapping = false;
      pos = disp;
    }
  }

  // arrows / list ease to a specific brand from wherever the scrub sits
  function step(dir) {
    goToIndex(Math.round(disp) + dir);
  }

  function goToIndex(i) {
    clearTimeout(snapId);
    cancelSnap();
    vel = 0;
    pos = clamp(i, 0, N - 1);
    snap();
  }

  function bindInput() {
    on(
      mount,
      "wheel",
      (e) => {
        if (sheetOpen) return; // let the View All list scroll natively
        e.preventDefault(); // full-viewport takeover: the slider owns the wheel
        cancelSnap();
        const dd = clamp(
          normalizeWheel(e) * CFG.wheelSpeed,
          -CFG.wheelStepMax,
          CFG.wheelStepMax,
        );
        pos = bound(pos + dd);
        vel = vel * 0.7 + dd * 0.3;
        scheduleSnap();
      },
      { passive: false },
    );

    let touchY = 0;
    let touching = false;
    on(
      mount,
      "touchstart",
      (e) => {
        if (sheetOpen) return;
        touching = true;
        touchY = e.touches[0].clientY;
        vel = 0;
        clearTimeout(snapId);
        cancelSnap();
      },
      { passive: true },
    );
    on(
      mount,
      "touchmove",
      (e) => {
        if (!touching) return;
        const y = e.touches[0].clientY;
        const dd = (touchY - y) / (mount.clientHeight || window.innerHeight);
        touchY = y;
        pos = bound(pos + dd);
        vel = vel * 0.6 + dd * 0.4;
        e.preventDefault(); // hijack the page scroll gesture
      },
      { passive: false },
    );
    on(
      mount,
      "touchend",
      () => {
        if (!touching) return;
        touching = false;
        snap();
      },
      { passive: true },
    );

    on(prevBtn, "click", () => step(-1));
    on(nextBtn, "click", () => step(1));
    on(learnBtn, "click", () => setExpanded(!expanded));

    /* ---- View All ---- */
    on(viewAllBtn, "click", () => (sheetOpen ? closeSheet() : openSheet()));
    on(listEl, "click", (e) => {
      const row = e.target.closest(".mfa-brands__row");
      if (!row) return;
      goToIndex(Number(row.dataset.index));
      closeSheet();
    });
    on(window, "keydown", (e) => {
      if (e.key === "Escape" && sheetOpen) closeSheet();
    });
  }

  /* --------------------------------------------------------------------------
     Visibility — stop the ticker when off-screen or in a background tab
     -------------------------------------------------------------------------- */

  function syncRunning() {
    setRunning(inView && !document.hidden);
  }

  function watchVisibility() {
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncRunning();
      },
      { threshold: 0.02 },
    );
    io.observe(mount);
    teardowns.push(() => io.disconnect());

    on(document, "visibilitychange", syncRunning);

    const onMotionChange = () => {
      reduced = motionQuery.matches;
      lastRendered = NaN; // re-render with/without parallax
    };
    motionQuery.addEventListener("change", onMotionChange);
    teardowns.push(() =>
      motionQuery.removeEventListener("change", onMotionChange),
    );

    // slide metrics + headline line-splitting are height/width dependent
    let resizeId = 0;
    on(
      window,
      "resize",
      () => {
        lastRendered = NaN; // force a reposition at the new size
        clearTimeout(resizeId);
        resizeId = window.setTimeout(revertHeadline, 150);
      },
      { passive: true },
    );
    teardowns.push(() => clearTimeout(resizeId));
  }

  /* --------------------------------------------------------------------------
     Init / teardown
     -------------------------------------------------------------------------- */

  const ctx = gsap.context(() => {
    totalOut.textContent = pad2(N);
    currentOut.textContent = pad2(1);
    live.textContent = `${BRANDS[0].name}, 1 of ${N}`;
    applyText(BRANDS[0]);

    buildSlides();
    render(0);
    bindInput();
    watchVisibility();
    syncRunning();
  }, mount);

  function destroy() {
    setRunning(false);
    clearTimeout(snapId);
    if (snapTween) snapTween.kill();
    teardowns.forEach((off) => off());
    teardowns.length = 0;
    killCardAnims();
    ctx.revert();
  }

  // handle for SPA route changes: mount._mfaDestroy()
  mount._mfaDestroy = destroy;
})();
