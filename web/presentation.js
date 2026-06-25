(function () {
    const allSlides = Array.from(document.querySelectorAll('.slide'));
    const mainSlides = allSlides.filter((slide) => !slide.classList.contains('backup'));
    const backupSlides = allSlides.filter((slide) => slide.classList.contains('backup'));

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const counter = document.getElementById('slide-counter');
    const progressBar = document.getElementById('progress-bar');

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const screenshotImages = Array.from(document.querySelectorAll('.screenshot-wrap img'));

    let index = 0;
    let activeBackup = null;
    let returnMainIndex = 0;
    let gallerySlides = [];
    let galleryIndex = 0;

    function isLightboxOpen() {
        return !lightbox.hidden;
    }

    function isBackupActive() {
        return activeBackup !== null;
    }

    function setActiveSlide(slide) {
        allSlides.forEach((item) => {
            item.classList.toggle('active', item === slide);
        });
    }

    function updateMainChrome() {
        counter.textContent = `${index + 1} / ${mainSlides.length}`;
        progressBar.style.width = `${((index + 1) / mainSlides.length) * 100}%`;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === mainSlides.length - 1;
    }

    function showMainSlide(nextIndex) {
        activeBackup = null;
        index = Math.max(0, Math.min(nextIndex, mainSlides.length - 1));
        setActiveSlide(mainSlides[index]);
        updateMainChrome();
    }

    function showBackupSlide(backupId) {
        const slide = backupSlides.find((item) => item.dataset.backup === backupId);
        if (!slide) return;

        if (isBackupActive() && activeBackup === slide) {
            showMainSlide(returnMainIndex);
            return;
        }

        if (!isBackupActive()) {
            returnMainIndex = index;
        }

        activeBackup = slide;
        setActiveSlide(slide);
        counter.textContent = 'Backup · FAQ';
        progressBar.style.width = '100%';
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    function next() {
        if (isBackupActive()) {
            showMainSlide(returnMainIndex);
            return;
        }
        showMainSlide(index + 1);
    }

    function prev() {
        if (isBackupActive()) {
            showMainSlide(returnMainIndex);
            return;
        }
        showMainSlide(index - 1);
    }

    function buildGalleryFromImage(img) {
        const stage = img.closest('.screenshot-stage') || img.closest('.screenshot-grid');
        const images = stage
            ? Array.from(stage.querySelectorAll('.screenshot-wrap img'))
            : [img];

        return images.map((item) => ({
            src: item.currentSrc || item.src,
            alt: item.alt || 'Screenshot',
        }));
    }

    function renderGallerySlide() {
        if (!gallerySlides.length) return;

        galleryIndex = (galleryIndex + gallerySlides.length) % gallerySlides.length;
        const slide = gallerySlides[galleryIndex];

        lightboxImage.src = slide.src;
        lightboxImage.alt = slide.alt;
        lightboxCaption.textContent = slide.alt;
        lightboxCounter.textContent = `${galleryIndex + 1} / ${gallerySlides.length}`;

        const hasMultiple = gallerySlides.length > 1;
        lightboxPrev.hidden = !hasMultiple;
        lightboxNext.hidden = !hasMultiple;
    }

    function openLightbox(img) {
        gallerySlides = buildGalleryFromImage(img);
        const stage = img.closest('.screenshot-stage') || img.closest('.screenshot-grid');
        const images = stage
            ? Array.from(stage.querySelectorAll('.screenshot-wrap img'))
            : [img];
        galleryIndex = Math.max(0, images.indexOf(img));

        renderGallerySlide();
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.removeAttribute('src');
        gallerySlides = [];
        galleryIndex = 0;
        document.body.classList.remove('lightbox-open');
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    });

    screenshotImages.forEach((img) => {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Enlarge screenshot: ${img.alt || 'app screen'}`);

        img.addEventListener('click', () => openLightbox(img));
        img.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(img);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (event) => {
        event.stopPropagation();
        galleryIndex -= 1;
        renderGallerySlide();
    });
    lightboxNext.addEventListener('click', (event) => {
        event.stopPropagation();
        galleryIndex += 1;
        renderGallerySlide();
    });

    document.addEventListener('keydown', (event) => {
        if (isLightboxOpen()) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeLightbox();
                return;
            }

            if (gallerySlides.length > 1 && event.key === 'ArrowLeft') {
                event.preventDefault();
                galleryIndex -= 1;
                renderGallerySlide();
                return;
            }

            if (gallerySlides.length > 1 && event.key === 'ArrowRight') {
                event.preventDefault();
                galleryIndex += 1;
                renderGallerySlide();
                return;
            }

            return;
        }

        if (event.key.toLowerCase() === 'b') {
            event.preventDefault();
            showBackupSlide('brightwheel');
            return;
        }

        if (isBackupActive() && event.key === 'Escape') {
            event.preventDefault();
            showMainSlide(returnMainIndex);
            return;
        }

        if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
            event.preventDefault();
            next();
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            event.preventDefault();
            prev();
        } else if (event.key === 'Home') {
            event.preventDefault();
            showMainSlide(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            showMainSlide(mainSlides.length - 1);
        } else if (event.key.toLowerCase() === 'f') {
            fullscreenBtn.click();
        }
    });

    showMainSlide(0);
})();
