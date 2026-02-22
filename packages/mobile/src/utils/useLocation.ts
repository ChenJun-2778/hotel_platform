// src/hooks/useLocation.ts
import { useState } from 'react';
import { Toast } from 'antd-mobile';
// 使用原生api拿当前的位置，再用高德api进行翻译
export const useLocation = () => {
  // 统一管理 loading 状态
  const [locating, setLocating] = useState(false);

  // 核心定位函数，返回一个 Promise，方便外部使用 async/await
  const getCurrentCity = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        Toast.show('您的浏览器不支持地理定位');
        reject(new Error('浏览器不支持定位'));
        return;
      }

      setLocating(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // 这里放你的高德 KEY
            const AMAP_KEY = 'ff4ae34e1da46218cb3b370ed03287a3'; 
            const amapUrl = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${AMAP_KEY}`;
            
            const response = await fetch(amapUrl);
            const data = await response.json();
            
            if (data.status === '1' && data.regeocode) {
              const addressComponent = data.regeocode.addressComponent;
              
              let rawCity = addressComponent.city;
              if (Array.isArray(rawCity) && rawCity.length === 0) {
                rawCity = addressComponent.province;
              }
              
              const finalCity = rawCity.replace('市', '');
              
              // 把城市名 resolve 出去
              resolve(finalCity);
            } else {
              Toast.show('解析位置失败');
              reject(new Error('解析失败'));
            }
          } catch (error) {
            console.error(error);
            Toast.show('网络请求失败');
            reject(error);
          } finally {
            setLocating(false);
          }
        },
        (error) => {
          setLocating(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              Toast.show('您拒绝了位置权限');
              break;
            case error.POSITION_UNAVAILABLE:
              Toast.show('无法获取当前位置信息');
              break;
            case error.TIMEOUT:
              Toast.show('定位请求超时');
              break;
            default:
              Toast.show('定位失败，请重试');
              break;
          }
          reject(error);
        },
        {
          enableHighAccuracy: true, 
          timeout: 5000,           
          maximumAge: 0             
        }
      );
    });
  };

  // 暴露状态和方法给组件使用
  return { locating, getCurrentCity };
};