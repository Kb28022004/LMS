import React from "react";
import {
  Avatar,
  Badge,
  Card,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";

const CourseCard = ({curCourse}) => {
  
  return (
    <div className="card">
      <Grid2  item xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 400, m: 2,gap:"10px",display:"flex",flexDirection:"column",padding:2 }}>
            <h4>{curCourse?.courseTitle}</h4>
          <CardMedia
            component="img"
            height="200"
            image={curCourse?.courseThumbnail}
            alt="Nicola Sturgeon on a TED talk stage"
            sx={{
                transition:"transform 0.5s ease-in-out",
                "&:hover":{
                    scale:(0.9)
                },
                borderRadius:"8px",
                cursor:"pointer"
            }}
          />
        <div className="cardHaider" style={{display:"flex",justifyContent:"space-between",alignItems:'center'}}>
         <div style={{display:"flex",justifyContent:"center",alignItems:'center',gap:"6px"}}>
         <Avatar src={curCourse?.creator?.profilePicture} />
         <p>{curCourse?.category}</p>
         </div>
         <Badge  sx={{  backgroundColor:"blue",color:"white",padding:'7px 14px',cursor:"pointer",fontSize:'15px',borderRadius:"12px"}} >
            {curCourse?.courseLevel}
         </Badge>
        </div>
          <Typography
            style={{
              fontWeight: "bold",

              fontSize: "18px",
            }}
          >
           ₹{curCourse?.coursePrice}
          </Typography>
        </Card>
      </Grid2>
    </div>
  );
};

export default CourseCard;
