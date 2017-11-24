import FontFaceObserver from 'fontfaceobserver';
import fonts from '../../../fontfaces.json';

if (!CSS.supports('font-display')) {
    const fontPromises = [];

    fonts.forEach((font) => {
        const family = font.family.replace('\'', '');
        const loader = new FontFaceObserver(family, {
            weight: font.weight,
            style: font.style
        });

        const promise = loader.load();
        fontPromises.push(promise);

        promise.then(() => {
            document.documentElement.className += ' wf-' + font.family.replace(/\s/g, '') + '-' + font.weight + '-' + font.style;
        });
    });

    // Maybe we should throw an event when fonts ar loaded
    // Promise.all(fontPromises).then(function () {
    //     console.log('All fonts loaded');
    // });
}
