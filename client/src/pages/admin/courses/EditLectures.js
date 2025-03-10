import React, { useEffect, useState } from "react";
import "./EditLectures.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import {
  useEditLecturesMutation,
  useGetSingleLectureQuery,
  useRemoveLecturesMutation,
  useRemoveLecturesQuery,
} from "../../../features/api/lectureApi";
import toast from "react-hot-toast";

const EditLectures = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const { courseId, lectureId } = useParams();

  const [editLectures, { data, isSuccess, isError, isLoading, error }] =
    useEditLecturesMutation();
  const [
    removeLectures,
    {
      data: removeLecturesData,
      isLoading: removeLecturesLoading,
      isSuccess: removeLecturesSuccess,
      error: removeLecturesError,
    },
  ] = useRemoveLecturesMutation();

  const {data:getSingleLectureData,isSuccess:getSingleLectureSuccess,isLoading:getSingleLectureLoading,error:getSingleLectureError}=useGetSingleLectureQuery(lectureId)

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    await editLectures({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setBtnDisabled(true);
        setUploadProgress(0);
        const res = await axios.post(
          "http://localhost:8000/api/v1/lecture/upload-video",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setBtnDisabled(false);
      }
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "lecture is edited successfull");
      navigate(-1)
    }
    if (isError && error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error, data, isError]);

  useEffect(() => {
    if (removeLecturesSuccess && removeLecturesData) {
      toast.success(
        removeLecturesData?.message || "lecture is edited successfull"
      );
      navigate(-1)
    }
    if (removeLecturesError) {
      toast.error(removeLecturesError?.data?.message);
    }
  }, [removeLecturesSuccess, removeLecturesError, removeLecturesData]);

  useEffect(() => {
    if (getSingleLectureData && getSingleLectureData?.lecture) {
      setLectureTitle(getSingleLectureData?.lecture?.lectureTitle);
      
      setUploadVideoInfo({
        videoUrl: getSingleLectureData?.lecture?.videoUrl,
        publicId: getSingleLectureData?.lecture?.publicId,
      });
  
      setIsFree(getSingleLectureData?.lecture?.isPreviewFree || false);
    }
  }, [getSingleLectureData]);
  
  

  return (
    <div className="editLecturesMainContainer">
      <div className="editLectureSection-1">
        <ArrowCircleLeftOutlinedIcon
          onClick={handleBack}
          className="ArrowCircleLeftOutlinedIcon"
        />
        <h2>Update Your Lecture</h2>
      </div>
      <div className="editLectureSection-2">
        <div className="editLectureSection-2-1">
          <h3>Edit Lecture</h3>
          <p>Make changes and click save when done</p>
        </div>
        <div className="editLectureSection-2-2">
          <Button
            onClick={() => removeLectures(lectureId)} // ✅ Pass the correct ID
            disabled={removeLecturesLoading}
            variant="contained"
            color="error"
          >
            {removeLecturesLoading ? (
              <>
                <CircularProgress size={16}  sx={{ color: "white", marginRight: "10px" }}/>
                <span style={{ color: "white" }}>Removing...</span>
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
        <div className="editLectureSection-2-3">
          <label htmlFor="lectureTitle">Title</label>
          <input
            placeholder="Add title of the lecture"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            name="lectureTitle"
            id="lectureTitle"
          />
        </div>
        <div className="editLectureSection-2-4">
          <label htmlFor="videoUrl">Video</label>
          <input
            onChange={fileChangeHandler}
            type="file"
            accept="video/*"
            name="videoUrl"
            id="videoUrl"
          />
          {uploadProgress > 0 && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginTop: "25px",
              }}
              className="progress-container"
            >
              <CircularProgress variant="determinate" value={uploadProgress} />
              <p>{uploadProgress}%</p>
            </div>
          )}
        </div>
        <div className="editLectureSection-2-5">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isFree}
                  
                  onChange={(e) => setIsFree(e.target.checked)}
                />
              }
              label="Is this video FREE"
            />
          </FormGroup>
        </div>
        <div className="editLectureSection-2-6">
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading || btnDisabled}
          >
            {isLoading || btnDisabled ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{ color: "white", marginRight: "10px" }}
                />
                <span style={{ color: "white" }}>Uploading...</span>
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditLectures;
