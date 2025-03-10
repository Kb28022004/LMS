import React from 'react';
import './SearchResult.css';
import { Card, CardContent, CardMedia } from '@mui/material';
import { NavLink } from 'react-router-dom';

const SearchResult = ({ data }) => {
    const courses = data?.courses || [];

    return (
        <div className='SearchResultMainContainer'>
            {courses.map((curCourse) => (
                <Card key={curCourse?._id} className='SearchResultCardContainer'>
                    <NavLink to={`/course/${curCourse?._id}`}>
                        <CardContent className='SearchResultCardItems'>
                            {/* ✅ FIXED IMAGE ISSUE */}
                            <CardMedia
                                component="img"
                                src={curCourse?.courseThumbnail}
                                alt={curCourse?.courseTitle}
                                className="SearchResultCardImage"
                            />
                            <div className="SearchResultCardItemsDetails">
                                <h2>{curCourse?.courseTitle}</h2>
                                <p>{curCourse?.subTitle}</p>
                                <p>Instructor: <span>{curCourse?.creator?.name || "Unknown"}</span></p>
                                <div>
                                    <p className="courseLevelBadge">{curCourse?.courseLevel}</p>
                                    <h3>₹{curCourse?.coursePrice.toLocaleString("en-IN")}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </NavLink>
                </Card>
            ))}
        </div>
    );
};

export default SearchResult;
