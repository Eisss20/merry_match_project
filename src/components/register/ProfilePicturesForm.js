import React, { useState, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../../components/register/SortableItem";

const ProfilePicturesForm = ({
  avatar,
  handleFileChange,
  handleRemoveImage,
  avatarError,
  handleAvatarUpdate,
}) => {
  const [avatars, setAvatars] = useState("");


  useEffect(() => {
    if (avatar) {
      setAvatars(avatar);
    }
  }, [avatar]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

  

    const activeIndex = parseInt(active.id, 10); 
    const overIndex = parseInt(over.id, 10); 

  

    if (activeIndex !== overIndex) {
      
      const updatedAvatars = { ...avatars };
  
      
      const activeAvatar = updatedAvatars[activeIndex];
      
      delete updatedAvatars[activeIndex];

      
      const newAvatars = {};
      let currentIndex = 0;
      Object.keys(updatedAvatars).forEach((key, index) => {
        if (currentIndex === overIndex) {
          newAvatars[overIndex] = activeAvatar;
          currentIndex++;
        }
        if (key !== String(activeIndex)) {
          newAvatars[currentIndex] = updatedAvatars[key];
          currentIndex++;
        }
      });

      
      if (overIndex >= Object.keys(updatedAvatars).length) {
        newAvatars[overIndex] = activeAvatar;
      }
  
      setAvatars(newAvatars); 

      handleAvatarUpdate(newAvatars); 
     
    }
  };

 
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );
 

  return (
    <form className="w-full max-w-4xl space-y-4 rounded-lg p-6">
      <h1 className="mb-4 font-nunito text-2xl text-[24px] font-bold leading-[30px] tracking-[-2%] text-second-500">
        Profile pictures
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {avatarError && (
          <small className="ml-2 pt-2 text-red-600">{avatarError}</small>
        )}
      </div>
      <div className="mx-auto mr-0 flex h-auto w-full flex-wrap gap-4 rounded-lg border-gray-300 p-0 lg:w-[931px]">
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext
            items={Object.keys(avatars)}
            strategy={horizontalListSortingStrategy} 
          >
            {Object.entries(avatars).map(([avatarKey, avatarFile]) => {
              const imageUrl = URL.createObjectURL(avatarFile);
              return (
                <SortableItem key={avatarKey} id={avatarKey}>
                  <img
                    src={imageUrl}
                    alt={`profile-${avatarKey}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={(event) => handleRemoveImage(event, avatarKey)} // ส่ง avatarKey แทน avatar
                    className="absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xl text-white hover:bg-red-700"
                  >
                    x
                  </button>
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>

    
        {Object.keys(avatars).length < 5 && (
          <div className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]">
            <label
              htmlFor="upload"
              className="flex h-full w-full items-center justify-center text-sm text-gray-500"
            >
              {Object.keys(avatars).length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <span className="flex flex-col items-center justify-center">
                    +<p className="text-lg font-medium">Upload photo</p>
                  </span>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="flex flex-col items-center justify-center">
                    +<p className="text-lg font-medium">Upload photo</p>
                  </span>
                </div>
              )}
              <input
                id="upload"
                name="avatar"
                type="file"
                onChange={handleFileChange}
                className="absolute z-10 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfilePicturesForm;
