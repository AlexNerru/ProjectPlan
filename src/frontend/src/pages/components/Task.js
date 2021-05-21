import React from "react";

import styled from "styled-components/macro";

import { Card, CardContent, Typography } from "@material-ui/core";

const TaskWrapperContent = styled(CardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const TopTaskWrapper = styled(Card)`
  border: 1px solid ${(props) => props.theme.palette.grey[300]};
  margin-bottom: ${(props) => props.theme.spacing(4)}px;
`;

const TaskWrapper = styled(TopTaskWrapper)`
  cursor: grab;

  &:hover {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

const TaskTitle = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  margin-right: ${(props) => props.theme.spacing(10)}px;
`;

const TaskDescription = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  margin-right: ${(props) => props.theme.spacing(10)}px;
`;

const TaskPlannedFinishDate = styled(Typography)`
  font-weight: 300;
  font-size: 12px;
  margin-right: ${(props) => props.theme.spacing(10)}px;
`;

export function Task({ content, topTask = false }) {
  if (topTask) {
    return (
      <TopTaskWrapper mt={4}>
        <TaskWrapperContent>
          <TaskDescription variant="body1" gutterBottom>
            {content.name}
          </TaskDescription>
        </TaskWrapperContent>
      </TopTaskWrapper>
    );
  }

  return (
    <TaskWrapper mt={4}>
      <TaskWrapperContent>
        <TaskDescription variant="body1" gutterBottom>
          Task#{content.id}
        </TaskDescription>

        <TaskTitle variant="body1" gutterBottom>
          {content.name}
        </TaskTitle>

        <TaskDescription variant="body1" gutterBottom>
          {content.description}
        </TaskDescription>

        <TaskPlannedFinishDate variant="body1" gutterBottom>
          Planned due: {content.planned_finish_date}
        </TaskPlannedFinishDate>

        <TaskPlannedFinishDate variant="body1" gutterBottom>
          Planned work hours: {content.planned_work_hours}
        </TaskPlannedFinishDate>
      </TaskWrapperContent>
    </TaskWrapper>
  );
}
