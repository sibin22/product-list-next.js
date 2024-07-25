import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Rating,
} from "@mui/material";
import styled from "@emotion/styled";
import { Review } from "../types";
import moment from "moment";

interface ProductReviewModalProps {
  open: boolean;
  handleClose: () => void;
  reviews: Review[];
}

//custom style for box using emotion
const StyledModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background-color: #ffffff;
  box-shadow: 24px;
  padding: 24px;
  border-radius: 8px;
  color: #333333;
`;
//custom style for listItem using emotion
const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #dddddd;
  padding: 16px 0;
`;

//custom style for typography using emotion
const ReviewerInfo = styled(Typography)`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`;

//custom style for typography using emotion
const Comment = styled(Typography)`
  margin-top: 8px;
  font-style: italic;
  color: #555555;
`;

//custom style for typography using emotion
const Date = styled(Typography)`
  margin-top: 4px;
  font-size: 12px;
  color: #999999;
`;

//custom style for list using emotion
const ScrollableList = styled(List)`
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

//custom style for typography using emotion
const CloseButton = styled(Typography)`
  position: absolute;
  top: 28px;
  right: 28px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
`;

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  open,
  handleClose,
  reviews,
}) => {
  return (
    // mui modal
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <StyledModalBox>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Product Reviews
        </Typography>
        <CloseButton onClick={handleClose}>X</CloseButton>
        <ScrollableList>
          {reviews.map((review, index) => (
            <StyledListItem key={index}>
              <Avatar>{review.reviewerName.charAt(0)}</Avatar>
              <ReviewerInfo>
                <Typography variant="body1" component="span">
                  {review.reviewerName}
                </Typography>

                <Rating value={review.rating} readOnly size="small" />
                <Comment>{review.comment}</Comment>
                <Date>{moment(review.date).format("MMM D, YYYY")}</Date>
              </ReviewerInfo>
            </StyledListItem>
          ))}
        </ScrollableList>
      </StyledModalBox>
    </Modal>
  );
};
