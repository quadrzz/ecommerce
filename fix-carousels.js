const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// 1. Revert the Bastidores carousel back to just the video tag
const BASTIDORES_CAROUSEL = `<Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]} className="w-full h-full"><CarouselContent className="h-full">{videoList.map((vid, idx) => (<CarouselItem key={idx} className="h-full"><video src={vid} autoPlay muted loop playsInline className="w-full h-full object-cover" /></CarouselItem>))}</CarouselContent></Carousel>`;

const REVERTED_BASTIDORES = `<video
                src={producaoVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />`;

content = content.replace(BASTIDORES_CAROUSEL, REVERTED_BASTIDORES);

// 2. Add Autoplay plugin to RESULTADOS REAIS carousel and change mapping
const RESULTADOS_REAIS_CAROUSEL_START = `<Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full max-w-4xl mx-auto">`;

const RESULTADOS_REAIS_MODIFIED_START = `<Carousel
            opts={{
              align: "start",
              loop: true
            }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            className="w-full max-w-4xl mx-auto">`;

content = content.replace(RESULTADOS_REAIS_CAROUSEL_START, RESULTADOS_REAIS_MODIFIED_START);

// 3. Replace the array map in RESULTADOS REAIS
const ARRAY_MAP_START = `{[
                { type: "image", src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=800&fit=crop", alt: "Quadro na sala" },
                { type: "image", src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop", alt: "Quadro no quarto" },
                { type: "image", src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=800&fit=crop", alt: "Quadro moderno" },
                { type: "image", src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=800&fit=crop", alt: "Decoração QUADRZZ" },
                { type: "image", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&h=800&fit=crop", alt: "Sala de estar" },
                { type: "image", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=800&fit=crop", alt: "Quadro decorativo" },
              ].map((item, i) => (`;

const ARRAY_MAP_END = `))}
            </CarouselContent>`;

// Let's use a regex to capture between <CarouselContent className="-ml-2 md:-ml-4"> and </CarouselContent> in that section.
// A simpler way:
let newItems = `{videoList.map((vid, idx) => (
                <CarouselItem key={idx} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden metal-border">
                    <video src={vid} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  </div>
                </CarouselItem>
              ))}`;

const regex = /<CarouselContent className="-ml-2 md:-ml-4">\s*\{\[\s*\{ type: "image"[^\]]+\]\.map\(\(item, i\) => \(\s*<CarouselItem key=\{i\} className="pl-2 md:pl-4 basis-full md:basis-1/2">\s*<div className="aspect-\[3\/4\] bg-secondary overflow-hidden metal-border">\s*<img src=\{item\.src\} alt=\{item\.alt\} className="w-full h-full object-cover" loading="lazy" \/>\s*<\/div>\s*<\/CarouselItem>\s*\)\)\}\s*<\/CarouselContent>/;

content = content.replace(regex, `<CarouselContent className="-ml-2 md:-ml-4">\n              ${newItems}\n            </CarouselContent>`);

fs.writeFileSync('src/pages/Index.tsx', content, 'utf8');
console.log('done');
