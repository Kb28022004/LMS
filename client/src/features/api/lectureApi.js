import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8000/api/v1/lecture";

export const lectureApi = createApi({
  reducerPath: "lectureApi",
  tagTypes: ["Refetch_Creator_Lectures"],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createLecture: builder.mutation({
      query: ({ values, id }) => ({
        url: `/create/${id}`,
        method: "POST",
        body: values,
      }),
    }),
    getPerticularCourseAllLectures: builder.query({
      query: (id) => ({
        url: `/get/${id}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Lectures"],
    }),
    editLectures: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `update/${lectureId}/course/${courseId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["Refetch_Creator_Lectures"],
    }),
    removeLectures: builder.mutation({
      query: (lectureId) => ({
        url: `delete/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Creator_Lectures"],
    }),
    getSingleLecture:builder.query({
        query:(id)=>({
            url:`single/get/${id}`,
            method:"GET"
        })
    })
  }),
});

export const {
  useCreateLectureMutation,
  useGetPerticularCourseAllLecturesQuery,
  useEditLecturesMutation,
  useRemoveLecturesMutation,
  useGetSingleLectureQuery
} = lectureApi;
