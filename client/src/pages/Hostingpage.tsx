import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api2/member';
import CommonBtn from '../components/common/CommonBtn/CommonBtn';
import AddressContainer from '../components/ghEdit/AddressContainer';
import FacilitiesContainer from '../components/ghEdit/FacilitiesContainer';
import GhDescription from '../components/ghEdit/GhDescription';
import Ghname from '../components/ghEdit/Ghname';
import ImageContainer from '../components/ghEdit/ImageContainer';
import RoomEdit from '../components/ghEdit/RoomEdit';
import TagContainer from '../components/ghEdit/TagContainer';
import useEditPage from '../hooks/useEditPage';
import { ghDataCheck, makeGhData } from '../libs/ghDatafunc';
import { ghCreateForm } from '../libs/ghEditCreateForm';
import { User2 } from '../types/user';
import { RootState } from '../store/store';
import Api from '../api2';
export default function Hostingpage() {
  const {
    guestHouseName,
    setGuestHouseName,
    address,
    setAddress,
    guestHouseTag,
    setGuestHouseTag,
    imgFiles,
    setImgFiles,
    guestHouseInfo,
    setGuestHouseInfo,
    rooms,
    setRooms,
    icons,
    setIcons,
  } = useEditPage();
  const navigate = useNavigate();
  const mainUser = useSelector((state: RootState) => state.user);

  const sendData = async () => {
    const flag = ghDataCheck({
      guestHouseName,
      address,
      guestHouseTag,
      imgFiles,
      guestHouseInfo,
      rooms,
    });

    if (flag) return;
    const userPhone = mainUser.memberPhone;
    const { guest_house_dto, roomImg, roomDto } = makeGhData({
      guestHouseName,
      address,
      guestHouseTag,
      imgFiles,
      guestHouseInfo,
      rooms,
      icons,
      userPhone,
    });

    const formData = ghCreateForm({
      guest_house_dto,
      roomImg,
      roomDto,
      imgFiles,
    });

    try {
      const accessToken = localStorage.getItem('accessToken');
      const postSurvey = await Api.post(`/api/auth/guesthouse`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `${accessToken}`,
        },
        transformRequest: (formData) => formData,
      });
      navigate('/ghadmin');
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const userCheck = async () => {
      try {
        const userGet = (await getUser()) as User2;
        if (
          userGet.memberRoles !== undefined &&
          userGet.memberRoles.length > 0
        ) {
          if (userGet.memberRoles[0] !== 'ADMIN') {
            alert('호스트가 아닙니다.');
            navigate('/');
          }
        } else {
          alert('호스트가 아닙니다');
          navigate('/');
        }
      } catch (e) {
        alert('로그인을 다시 해주세요.');
        navigate('/');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('persist:root');
        localStorage.removeItem('accessToken');
        window.location.reload();
      }
    };
    userCheck();
  }, []);

  return (
    <div className="w-full p-5">
      <div className="w-full flex-col self-center flex gap-y-4 md:gap-y-7">
        <Ghname
          guestHouseName={guestHouseName}
          setGuestHouseName={setGuestHouseName}
        />
        <div className="flex flex-col w-full md:flex-row ">
          <AddressContainer address={address} setAddress={setAddress} />
          <TagContainer
            guestHouseTag={guestHouseTag}
            setGuestHouseTag={setGuestHouseTag}
          />
        </div>
        <ImageContainer imgFiles={imgFiles} setImgFiles={setImgFiles} />
        <GhDescription
          guestHouseInfo={guestHouseInfo}
          setGuestHouseInfo={setGuestHouseInfo}
        />
        <RoomEdit rooms={rooms} setRooms={setRooms} mode={'create'} />
        <FacilitiesContainer icons={icons} setIcons={setIcons} />
        <div className="flex justify-center mt-5 md:mt-10 mb-20">
          {/* 28 14  */}
          <CommonBtn
            btnSize="w-28 h-14 mr-20 md:mr-30 md:w-28 md:h-14"
            text="작성 취소"
            btnFs="text-lg"
            btnHandler={() => {
              console.log('라우터 달기');
            }}
          />
          <CommonBtn
            btnSize="w-28 h-14 md:w-28 md:h-14"
            btnFs="text-lg"
            text="숙소 등록"
            btnHandler={sendData}
          />
        </div>
      </div>
    </div>
  );
}
