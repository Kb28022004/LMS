import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // ✅ Fixed Import

const BASE_URL = "http://localhost:8000/api/v1/course"; // ✅ Base URL

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course","Refetch_Published_Course"],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // ✅ Correct Usage
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (values) => ({
        url: "create", // ✅ Fixed URL (Relative to BASE_URL)
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getAllCreatorCourses: builder.query({
      query: () => ({
        url: "getall",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    updateCourses: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `update/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getSingleCourseDetails: builder.query({
      query: (courseId) => ({
        url: `getsingle/${courseId}`,
        method: "GET",
      }),
    }),
    publisheNewCourse:builder.mutation({
      query:({courseId,query})=>({
        url:`publish/${courseId}?publish=${query}`,
        method:"PUT",
      })
    }),
    getAllPublishedCourses:builder.query({
      query:()=>({
        url:"published",
        method:"GET"
      }),
      providesTags: ["Refetch_Published_Course"],
    }),
    getCourseDetailsWithPurchaseStatus:builder.query({
      query:(courseId)=>({
        url:`/detail-with-status/${courseId}`,
        method:"GET"
      })
    }),
    getSearchCourses: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;
    
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }
    
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }
    
    
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
    
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCreatorCoursesQuery,
  useUpdateCoursesMutation,
  useGetSingleCourseDetailsQuery,
  usePublisheNewCourseMutation,
  useGetAllPublishedCoursesQuery,
  useGetCourseDetailsWithPurchaseStatusQuery,
  useGetSearchCoursesQuery
} = courseApi;
