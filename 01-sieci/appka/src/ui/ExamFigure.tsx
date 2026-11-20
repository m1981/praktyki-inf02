/** Rysunek z arkusza egzaminacyjnego pod ćwiczeniami – poglądowo, bez interakcji. */
export interface Figure {
 src: string;
 alt: string;
 caption: string;
}

export function ExamFigure({ figure }: { figure: Figure }) {
 return (
  <figure className="sh-figure">
   <img src={figure.src} alt={figure.alt} />
   <figcaption>{figure.caption}</figcaption>
  </figure>
 );
}
