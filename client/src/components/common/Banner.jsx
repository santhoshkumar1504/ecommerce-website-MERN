import banner1 from '../../assets/banner1.png';
import banner2 from '../../assets/banner2.png';
import banner3 from '../../assets/banner3.png';
import banner4 from '../../assets/banner4.png';
import banner5 from '../../assets/banner5.png';
import Carousel from 'react-bootstrap/Carousel';

const Banner=()=> {
  return (
    <Carousel data-bs-theme="dark" className="custom-carousel" fade interval={3000}>
      <Carousel.Item>
        <img
          className="d-block w-100 banner"
          src={banner1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 banner"
          src={banner2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 banner"
          src={banner5}
          alt="Fiveth slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 banner"
          src={banner3}
          alt="Third slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 banner"
          src={banner4}
          alt="Fourth slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Banner;