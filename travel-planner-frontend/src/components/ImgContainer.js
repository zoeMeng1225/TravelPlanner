import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import '../styles/SearchResult.css';


const contentStyle = {
  height: '100%'
};


const ImgContainer = ({ cityImg }) => {
    return (
      <Carousel autoplay>
        <div>
          <img src={require('../asset/image/pic1.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic2.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic9.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic3.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic4.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic5.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic6.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic7.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic8.jpg')} alt=""/>
        </div>
        <div>
          <img src={require('../asset/image/pic10.jpg')} alt=""/>
        </div>
    </Carousel>
  )
}

ImgContainer.propTypes = {
    cityImg: PropTypes.string.isRequired,
}

export default ImgContainer;
