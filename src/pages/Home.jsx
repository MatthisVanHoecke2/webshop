export default function Home() {
  const arr = Array(4).fill({src: 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png', alt: 'banner'});
  
  return (
    <>
        {arr.map((el, index) => (
          <img src={el.src} alt={el.alt} key={index}/>
        ))}
    </>
  );
}