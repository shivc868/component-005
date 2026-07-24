/* Brand slider — a scroll-driven vertical stack of full-bleed brand photos.
   Wheel/touch scrubs it, releasing snaps to the nearest brand with a parallax
   drift on the photos, and the glass card swaps its copy to match. Mounts on
   #mfa-root. */

import "./style.css";
import "./demo.css"; // demo page only — don't ship this one
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// Edit this to change the brands. `photo` is the Unsplash id — the part after
// "photo-" in the URL; keep `alt` describing whatever you point it at.
const BRANDS = [
  {
    name: "Meridian",
    photo: "1441974231531-c6227db76b6e",
    tagline: "It starts outside.",
    claim: "The trail is for",
    highlight: "everyone",
    headline: "We exist to share the simple power of being outside.",
    about:
      "Twenty-two years of footwear built for the ground between the trailhead and the summit — tested by the people who spend every weekend out there.",
    alt: "Sunlit dirt trail winding through a dense forest of tall trees",
    shop: "https://example.com/meridian/shop",
    jobs: "https://example.com/meridian/careers",
  },
  {
    name: "Kestrel",
    photo: "1483721310020-03333e577078",
    tagline: "Every street is a start line.",
    claim: "Built for the",
    highlight: "first mile",
    headline: "Fast shoes for people whose training plan is simply: go.",
    about:
      "Road racers and daily trainers developed with city runners — light enough for intervals, honest enough for a Tuesday commute.",
    alt: "Runner crouching to tie a shoelace on an empty city street",
    shop: "https://example.com/kestrel/shop",
    jobs: "https://example.com/kestrel/careers",
  },
  {
    name: "Northbound",
    photo: "1506905925346-21bda4d32df4",
    tagline: "Above the cloud line.",
    claim: "Made for the",
    highlight: "long ascent",
    headline:
      "Technical layers tested where the weather changes its mind hourly.",
    about:
      "Shells, insulation and hardware for alpine starts — built with guides who need every zip to work with gloves on.",
    alt: "Snow-covered mountain peaks rising above a sea of clouds at sunrise",
    shop: "https://example.com/northbound/shop",
    jobs: "https://example.com/northbound/careers",
  },
  {
    name: "Ironwood",
    photo: "1517836357463-d25dfeac3438",
    tagline: "Earn the weight.",
    claim: "Nothing here is",
    highlight: "decorative",
    headline: "Training gear built to be used badly and last anyway.",
    about:
      "Belts, bars and footwear for garage gyms and shift work — overbuilt on purpose, replaced far less often.",
    alt: "Athlete gripping a loaded barbell on wet outdoor paving",
    shop: "https://example.com/ironwood/shop",
    jobs: "https://example.com/ironwood/careers",
  },
  {
    name: "Driftway",
    photo: "1502680390469-be75c86b636f",
    tagline: "Salt first.",
    claim: "The session starts at",
    highlight: "dawn",
    headline:
      "Boardshorts and wetsuits for people who check the swell before the news.",
    about:
      "Warm-water suits and quick-dry basics shaped around long sessions and short drives to the coast.",
    alt: "Surfer riding inside the barrel of a turquoise breaking wave",
    shop: "https://example.com/driftway/shop",
    jobs: "https://example.com/driftway/careers",
  },
  {
    name: "Fieldnote",
    photo: "1470071459604-3b5ec3a7fe05",
    tagline: "Pack light. Stay longer.",
    claim: "Everything you own in",
    highlight: "one bag",
    headline: "Travel goods designed around the things you actually carry.",
    about:
      "Carry-on luggage, packing systems and jackets that survive the third connecting flight without looking like it.",
    alt: "Mist rolling over green cliffs beside a winding road at sunset",
    shop: "https://example.com/fieldnote/shop",
    jobs: "https://example.com/fieldnote/careers",
  },
  {
    name: "Cornice",
    photo: "1551698618-1dfe5d97d256",
    tagline: "First chair, every time.",
    claim: "Warm is not",
    highlight: "optional",
    headline: "Mountain kit for the days that start before the lifts do.",
    about:
      "Insulated outerwear and gloves developed on resort patrol shifts, where a failed seam ends the day.",
    alt: "Skier carving a turn down a freshly groomed sunlit slope",
    shop: "https://example.com/cornice/shop",
    jobs: "https://example.com/cornice/careers",
  },
  {
    name: "Halcyon",
    photo: "1530549387789-4c1017266635",
    tagline: "Lane four. Lights on.",
    claim: "Where the day gets",
    highlight: "quiet",
    headline: "Swimwear engineered for the hour nobody sees you train.",
    about:
      "Chlorine-proof racing suits and goggles refined over four seasons of masters and club programmes.",
    alt: "Swimmer surfacing mid-butterfly stroke in a blue competition pool",
    shop: "https://example.com/halcyon/shop",
    jobs: "https://example.com/halcyon/careers",
  },
  {
    name: "Sawtooth",
    photo: "1517649763962-0c623066013b",
    tagline: "Hold the wheel.",
    claim: "Won in the",
    highlight: "last kilometre",
    headline: "Race kit shaped by riders who count grams and mean it.",
    about:
      "Bib shorts, jerseys and shoes tested across a full road season — nothing ships until someone has raced it.",
    alt: "Tight peloton of road cyclists racing along a closed road",
    shop: "https://example.com/sawtooth/shop",
    jobs: "https://example.com/sawtooth/careers",
  },
  {
    name: "Stillwater",
    photo: "1501785888041-af3ef285b470",
    tagline: "Slow is a skill.",
    claim: "Best days are the",
    highlight: "unplanned ones",
    headline: "Easy gear for weekends measured in daylight, not distance.",
    about:
      "Swim shorts, sandals and soft goods for lake mornings, long lunches and the walk back at dusk.",
    alt: "Wooden rowing boats on a turquoise alpine lake below steep cliffs",
    shop: "https://example.com/stillwater/shop",
    jobs: "https://example.com/stillwater/careers",
  },
  {
    name: "Lumen",
    photo: "1552674605-db6ffd4facb5",
    tagline: "Run after dark.",
    claim: "Seen from",
    highlight: "300 metres",
    headline: "Reflective running gear for the miles that happen after work.",
    about:
      "High-visibility layers and lighting built with winter run clubs, where being noticed is the whole product.",
    alt: "Three runners silhouetted against a deep blue dusk sky on a road",
    shop: "https://example.com/lumen/shop",
    jobs: "https://example.com/lumen/careers",
  },
];

const CFG = {
  wheelSpeed: 0.0013, // wheel px -> slide units
  wheelStepMax: 1.7, // clamp on a single wheel event
  maxPerGesture: 1, // max slides one continuous gesture can travel (tames trackpad flings)
  gestureGap: 60, // ms without a wheel event that ends a gesture
  lerp: 0.1, // free-scroll smoothing per frame
  snapDelay: 100, // ms of idle before the snap fires
  snapDuration: 1, // eased settle onto a brand
  snapEase: "power1.out",
  velocityBias: 0.1, // flick influence on the 50% snap
  overscroll: 0.12, // rubber-band past the first/last brand
  parallax: 0.36, // image drift vs its slide
  imgQuality: 100,
  textSeconds: 0.62,
  exitSeconds: 0.26,
};

const N = BRANDS.length;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const pad2 = (n) => `${n}`.padStart(2, "0");
const bound = (p) => clamp(p, -CFG.overscroll, N - 1 + CFG.overscroll);
const photoUrl = (id, w, q = CFG.imgQuality) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

class BrandSlider {
  #dom;
  #slides = [];
  #ac = new AbortController();
  #io;
  #motion = matchMedia("(prefers-reduced-motion: reduce)");

  #pos = 0; // scroll target, in slide units
  #disp = 0; // eased render position
  #prevDisp = 0;
  #active = 0;
  #vel = 0; // smoothed input velocity, biases the snap
  #lastWheel = 0; // timestamp of the last wheel event, to split gestures
  #gestureDelta = 0; // slides travelled so far in the current gesture
  #snapId = 0;
  #resizeId = 0;
  #snapping = false;
  #snapTween = null;
  #running = false;
  #inView = true;
  #lastRendered = NaN;
  #expanded = false;
  #sheetOpen = false;
  #lastFocus = null;
  #touching = false;
  #touchY = 0;
  #outTl;
  #inTl;
  #split;

  constructor(root) {
    this.root = root;
    const q = (key) => root.querySelector(`[data-mfa="${key}"]`);
    this.#dom = {
      stage: q("stage"),
      live: q("live"),
      wordmark: q("wordmark"),
      tagline: q("tagline"),
      claim: q("claim"),
      highlight: q("highlight"),
      headline: q("headline"),
      more: q("more"),
      about: q("about"),
      learnBtn: q("learn"),
      learnLabel: q("learn-label"),
      shopLink: q("shop"),
      jobsLink: q("jobs"),
      nameOut: q("name"),
      currentOut: q("current"),
      totalOut: q("total"),
      prevBtn: q("prev"),
      nextBtn: q("next"),
      viewAllBtn: q("viewall"),
      viewAllLabel: q("viewall-label"),
      sheet: q("sheet"),
      listEl: q("list"),
      tags: root.querySelector(".mfa-brands__tags"),
      actions: root.querySelector(".mfa-brands__actions"),
    };

    const { totalOut, currentOut, live } = this.#dom;
    totalOut.textContent = pad2(N);
    currentOut.textContent = pad2(1);
    live.textContent = `${BRANDS[0].name}, 1 of ${N}`;

    this.#applyText(BRANDS[0]);
    this.#buildSlides();
    this.#render(0);
    this.#listen();
    this.#syncRunning();
  }

  get #reduced() {
    return this.#motion.matches;
  }

  // collapse durations to ~0 when reduced motion is on
  #dur = (s) => (this.#reduced ? 0.001 : s);

  /* ---- photo stack ---- */

  #buildSlides() {
    const w = innerWidth > 900 ? 1920 : 1080;
    this.#slides = BRANDS.map((brand, i) => {
      const slide = document.createElement("div");
      slide.className = "mfa-brands__slide";
      const img = Object.assign(document.createElement("img"), {
        className: "mfa-brands__img",
        src: photoUrl(brand.photo, w),
        alt: brand.alt,
        decoding: "async",
        loading: i <= 1 || i === N - 1 ? "eager" : "lazy",
        fetchPriority: i === 0 ? "high" : "auto",
      });
      slide.append(img);
      this.#dom.stage.append(slide);
      return { slide, img };
    });
  }

  // position each slide by its distance from `d`; the image lags for parallax,
  // and anything more than a slide away is parked and hidden
  #render(d) {
    const h = this.root.clientHeight || innerHeight;
    const p = this.#reduced ? 0 : CFG.parallax;
    for (const [i, { slide, img }] of this.#slides.entries()) {
      const delta = i - d;
      if (Math.abs(delta) > 1.2) {
        if (slide.style.visibility !== "hidden")
          slide.style.visibility = "hidden";
        continue;
      }
      slide.style.visibility = "visible";
      slide.style.zIndex = 50 - Math.round(Math.abs(delta) * 10);
      slide.style.transform = `translate3d(0,${delta * h}px,0)`;
      img.style.transform = `translate3d(0,${-delta * h * p}px,0)`;
    }
  }

  #refreshActive() {
    const next = clamp(Math.round(this.#disp), 0, N - 1);
    if (next === this.#active) return;
    const dir = this.#disp >= this.#prevDisp ? 1 : -1;
    this.#active = next;
    this.#swapCard(BRANDS[next], dir);
    this.#rollCounter(next, dir);
    this.#markActiveRow();
    this.#dom.live.textContent = `${BRANDS[next].name}, ${next + 1} of ${N}`;
  }

  /* ---- card copy: headline always shows, Learn more reveals the description ---- */

  #revertHeadline() {
    this.#split?.revert(); // unwrap so it reflows normally on resize
    this.#split = null;
  }

  #killCardAnims() {
    this.#outTl?.kill();
    this.#inTl?.kill();
    this.#revertHeadline();
  }

  #applyText(brand) {
    const d = this.#dom;
    d.wordmark.textContent = brand.name;
    d.wordmark.insertAdjacentHTML("beforeend", "<i>.</i>");
    d.tagline.textContent = brand.tagline;
    d.claim.textContent = brand.claim;
    d.highlight.textContent = brand.highlight;
    d.headline.textContent = brand.headline;
    d.about.textContent = brand.about;
    d.shopLink.href = brand.shop;
    d.jobsLink.href = brand.jobs;
    d.shopLink.setAttribute("aria-label", `Shop ${brand.name}`);
    d.jobsLink.setAttribute("aria-label", `Job opportunities at ${brand.name}`);
    d.nameOut.textContent = brand.name;
  }

  #animateIn(dir) {
    const { headline, tags, actions, wordmark } = this.#dom;
    const dur = this.#dur;
    this.#split = new SplitText(headline, { type: "lines", mask: "lines" });
    gsap.set(headline, { autoAlpha: 1, y: 0 }); // exit tween hid it — show before the lines slide up
    this.#inTl = gsap
      .timeline()
      .fromTo(
        this.#split.lines,
        { yPercent: 110 * dir },
        {
          yPercent: 0,
          duration: dur(CFG.textSeconds),
          stagger: dur(0.06),
          ease: "power3.out",
          onComplete: () => this.#revertHeadline(),
        },
        0,
      )
      .fromTo(
        tags,
        { autoAlpha: 0, y: 14 * dir },
        { autoAlpha: 1, y: 0, duration: dur(0.45), ease: "power2.out" },
        0.04,
      )
      .fromTo(
        actions,
        { autoAlpha: 0, y: 16 * dir },
        { autoAlpha: 1, y: 0, duration: dur(0.5), ease: "power2.out" },
        0.12,
      )
      .fromTo(
        wordmark,
        { autoAlpha: 0, y: 10 * dir, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: dur(0.55),
          ease: "power2.out",
        },
        0,
      );
  }

  #swapCard(brand, dir) {
    const { tags, headline, actions, wordmark } = this.#dom;
    const dur = this.#dur;
    this.#killCardAnims();
    if (this.#expanded) this.#setExpanded(false);
    this.#outTl = gsap
      .timeline({
        onComplete: () => {
          this.#applyText(brand);
          this.#animateIn(dir);
        },
      })
      .to(
        [tags, headline, actions],
        {
          autoAlpha: 0,
          y: -14 * dir,
          duration: dur(CFG.exitSeconds),
          stagger: dur(0.03),
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
          duration: dur(CFG.exitSeconds),
          ease: "power2.in",
        },
        0,
      );
  }

  #setExpanded(next) {
    const { learnBtn, learnLabel, more } = this.#dom;
    this.#expanded = next;
    learnBtn.setAttribute("aria-expanded", String(next));
    learnLabel.textContent = next ? "Close" : "Learn more";
    gsap.killTweensOf(more);
    gsap.to(more, {
      height: next ? "auto" : 0,
      duration: this.#dur(0.45),
      ease: "power3.inOut",
    });
  }

  // roll the current-slide number like an odometer
  #rollCounter(n, dir) {
    const { currentOut } = this.#dom;
    const dur = this.#dur;
    gsap.killTweensOf(currentOut);
    gsap
      .timeline()
      .to(currentOut, {
        yPercent: -110 * dir,
        autoAlpha: 0,
        duration: dur(0.18),
        ease: "power2.in",
      })
      .add(() => {
        currentOut.textContent = pad2(n + 1);
      })
      .fromTo(
        currentOut,
        { yPercent: 110 * dir, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: dur(0.3), ease: "power2.out" },
      );
  }

  /* ---- View All list ---- */

  #buildList() {
    const { listEl } = this.#dom;
    if (listEl.childElementCount) return;
    listEl.innerHTML = BRANDS.map(
      (
        brand,
        i,
      ) => `<button type="button" class="mfa-brands__row" data-index="${i}" aria-label="Show ${brand.name}">
        <span class="mfa-brands__row-thumb"><img src="${photoUrl(brand.photo, 480, 65)}" alt="" loading="lazy" decoding="async"></span>
        <span class="mfa-brands__row-name">${brand.name}</span>
      </button>`,
    ).join("");
    this.#markActiveRow();
  }

  #markActiveRow() {
    for (const [i, row] of this.#dom.listEl
      .querySelectorAll(".mfa-brands__row")
      .entries()) {
      const on = i === this.#active;
      row.classList.toggle("mfa-is-active", on);
      if (on) row.setAttribute("aria-current", "true");
      else row.removeAttribute("aria-current");
    }
  }

  #setViewAll(open) {
    const { viewAllBtn, viewAllLabel } = this.#dom;
    viewAllBtn.setAttribute("aria-expanded", String(open));
    viewAllLabel.textContent = open ? "Close" : "View All";
    viewAllBtn.setAttribute(
      "aria-label",
      open ? "Close brand list" : "View all brands",
    );
    this.root.classList.toggle("mfa-is-listing", open);
  }

  #openSheet() {
    const { sheet, listEl } = this.#dom;
    const dur = this.#dur;
    this.#buildList();
    this.#lastFocus = document.activeElement;
    this.#sheetOpen = true;
    sheet.hidden = false;
    this.#setViewAll(true);
    gsap.fromTo(
      sheet,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: dur(0.3), ease: "power2.out" },
    );
    gsap.fromTo(
      listEl.children,
      { autoAlpha: 0, x: -18 },
      {
        autoAlpha: 1,
        x: 0,
        duration: dur(0.5),
        stagger: dur(0.04),
        ease: "power3.out",
      },
    );
    listEl.children[this.#active]?.scrollIntoView({
      block: "nearest",
      behavior: this.#reduced ? "auto" : "smooth",
    });
  }

  #closeSheet() {
    if (!this.#sheetOpen) return;
    const { sheet } = this.#dom;
    this.#sheetOpen = false;
    this.#setViewAll(false);
    gsap.to(sheet, {
      autoAlpha: 0,
      duration: this.#dur(0.25),
      ease: "power2.in",
      onComplete: () => {
        sheet.hidden = true;
        gsap.set(sheet, { clearProps: "opacity,visibility" });
      },
    });
    if (this.#lastFocus && this.root.contains(this.#lastFocus))
      this.#lastFocus.focus();
    this.#lastFocus = null;
  }

  /* ---- scroll engine ---- */

  // ease toward the target every frame; while a snap tween owns disp it writes
  // disp itself, so the lerp stands down
  #tick = () => {
    if (!this.#snapping) {
      const d = this.#pos - this.#disp;
      this.#disp =
        Math.abs(d) < 0.00006 ? this.#pos : this.#disp + d * CFG.lerp;
    }
    if (this.#disp !== this.#lastRendered) {
      this.#render(this.#disp);
      this.#refreshActive();
      this.#prevDisp = this.#disp;
      this.#lastRendered = this.#disp;
    }
  };

  #setRunning(next) {
    if (next === this.#running) return;
    this.#running = next;
    next ? gsap.ticker.add(this.#tick) : gsap.ticker.remove(this.#tick);
  }

  #syncRunning = () => this.#setRunning(this.#inView && !document.hidden);

  // fold pixel/line/page wheel deltas to a common scale so devices feel the same
  #wheelDelta(e) {
    if (e.deltaMode === 1) return e.deltaY * 16;
    if (e.deltaMode === 2)
      return e.deltaY * (this.root.clientHeight || innerHeight);
    return e.deltaY;
  }

  // settle onto the nearest brand: round() is the 50% rule, the velocity term
  // lets a flick carry past it, and the eased tween gives the deceleration
  #snap() {
    const dest = clamp(
      Math.round(this.#pos + clamp(this.#vel * CFG.velocityBias, -0.49, 0.49)),
      0,
      N - 1,
    );
    this.#pos = dest;
    this.#vel = 0;
    this.#snapTween?.kill();
    this.#snapping = true;
    const proxy = { v: this.#disp };
    this.#snapTween = gsap.to(proxy, {
      v: dest,
      duration: this.#dur(CFG.snapDuration),
      ease: CFG.snapEase,
      onUpdate: () => {
        this.#disp = proxy.v;
      },
      onComplete: () => {
        this.#snapping = false;
        this.#snapTween = null;
      },
    });
  }

  #scheduleSnap() {
    clearTimeout(this.#snapId);
    this.#snapId = setTimeout(() => this.#snap(), CFG.snapDelay);
  }

  // any fresh input drops an in-flight snap and resumes free scroll from here
  #cancelSnap() {
    this.#snapTween?.kill();
    this.#snapTween = null;
    if (this.#snapping) {
      this.#snapping = false;
      this.#pos = this.#disp;
    }
  }

  #goToIndex(i) {
    clearTimeout(this.#snapId);
    this.#cancelSnap();
    this.#vel = 0;
    this.#pos = clamp(i, 0, N - 1);
    this.#snap();
  }

  #step = (dir) => this.#goToIndex(Math.round(this.#disp) + dir);

  /* ---- input ---- */

  #onWheel = (e) => {
    if (this.#sheetOpen) return; // let the list scroll natively
    e.preventDefault();

    // a mouse fires one notch per gesture; a trackpad fires a dense stream plus
    // a momentum tail. Reset the per-gesture budget only after a real pause, so
    // one continuous trackpad flick moves a single slide instead of several.
    const now = performance.now();
    if (now - this.#lastWheel > CFG.gestureGap) this.#gestureDelta = 0;
    this.#lastWheel = now;

    const raw = clamp(
      this.#wheelDelta(e) * CFG.wheelSpeed,
      -CFG.wheelStepMax,
      CFG.wheelStepMax,
    );
    const capped = clamp(
      this.#gestureDelta + raw,
      -CFG.maxPerGesture,
      CFG.maxPerGesture,
    );
    const dd = capped - this.#gestureDelta;
    this.#gestureDelta = capped;
    if (dd === 0) return; // budget spent — swallow the momentum tail so the snap lands

    this.#cancelSnap();
    this.#pos = bound(this.#pos + dd);
    this.#vel = this.#vel * 0.7 + dd * 0.3;
    this.#scheduleSnap();
  };

  #onTouchStart = (e) => {
    if (this.#sheetOpen) return;
    this.#touching = true;
    this.#touchY = e.touches[0].clientY;
    this.#vel = 0;
    clearTimeout(this.#snapId);
    this.#cancelSnap();
  };

  #onTouchMove = (e) => {
    if (!this.#touching) return;
    const y = e.touches[0].clientY;
    const dd = (this.#touchY - y) / (this.root.clientHeight || innerHeight);
    this.#touchY = y;
    this.#pos = bound(this.#pos + dd);
    this.#vel = this.#vel * 0.6 + dd * 0.4;
    e.preventDefault();
  };

  #onTouchEnd = () => {
    if (!this.#touching) return;
    this.#touching = false;
    this.#snap();
  };

  #listen() {
    const { signal } = this.#ac;
    const { root } = this;
    const { prevBtn, nextBtn, learnBtn, viewAllBtn, listEl } = this.#dom;

    root.addEventListener("wheel", this.#onWheel, { passive: false, signal });
    root.addEventListener("touchstart", this.#onTouchStart, {
      passive: true,
      signal,
    });
    root.addEventListener("touchmove", this.#onTouchMove, {
      passive: false,
      signal,
    });
    root.addEventListener("touchend", this.#onTouchEnd, {
      passive: true,
      signal,
    });

    prevBtn.addEventListener("click", () => this.#step(-1), { signal });
    nextBtn.addEventListener("click", () => this.#step(1), { signal });
    learnBtn.addEventListener(
      "click",
      () => this.#setExpanded(!this.#expanded),
      { signal },
    );
    viewAllBtn.addEventListener(
      "click",
      () => (this.#sheetOpen ? this.#closeSheet() : this.#openSheet()),
      { signal },
    );
    listEl.addEventListener(
      "click",
      (e) => {
        const row = e.target.closest(".mfa-brands__row");
        if (!row) return;
        this.#goToIndex(Number(row.dataset.index));
        this.#closeSheet();
      },
      { signal },
    );
    addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && this.#sheetOpen) this.#closeSheet();
      },
      { signal },
    );

    // pause the ticker off-screen or in a background tab
    this.#io = new IntersectionObserver(
      ([e]) => {
        this.#inView = e.isIntersecting;
        this.#syncRunning();
      },
      { threshold: 0.02 },
    );
    this.#io.observe(root);
    document.addEventListener("visibilitychange", this.#syncRunning, {
      signal,
    });
    this.#motion.addEventListener(
      "change",
      () => {
        this.#lastRendered = NaN;
      },
      { signal },
    );
    addEventListener(
      "resize",
      () => {
        this.#lastRendered = NaN; // reposition at the new size
        clearTimeout(this.#resizeId);
        this.#resizeId = setTimeout(() => this.#revertHeadline(), 150);
      },
      { passive: true, signal },
    );
  }

  // for SPA route changes: mount._mfaDestroy()
  destroy = () => {
    this.#setRunning(false);
    clearTimeout(this.#snapId);
    clearTimeout(this.#resizeId);
    this.#snapTween?.kill();
    this.#io?.disconnect();
    this.#ac.abort();
    this.#killCardAnims();
  };
}

const mount = document.querySelector("#mfa-root");
if (mount) mount._mfaDestroy = new BrandSlider(mount).destroy;
