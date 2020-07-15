import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { LittleText } from '../core';
import {
  scheduledTime,
  scheduledEndTime,
  lastScheduledTime,
  lastScheduledEndTime,
} from '../../services/time';

const styles = StyleSheet.create({
  textStyles: {
    marginTop: 6,
  },
});

const ActivityDueDate = ({ activity }) => {
  const nextScheduledTime = scheduledTime(activity.nextScheduledTimestamp);
  const nextScheduledEndTime = scheduledEndTime(activity.nextScheduledTimestamp, activity.nextTimeout);
  const prevScheduledTime = lastScheduledTime(
    activity.lastScheduledTimestamp,
  );
  const prevScheduledEndTime = lastScheduledEndTime(
    activity.lastScheduledTimestamp,
    activity.lastTimeout,
  );
  if (
    (activity.status === 'scheduled' || activity.status === 'in-progress')
    && activity.nextScheduledTimestamp
    && nextScheduledTime
  ) {
    return (
      <LittleText style={styles.textStyles}>
        Available: {nextScheduledTime} to {nextScheduledEndTime}
      </LittleText>
    );
  }
  if (activity.status === 'pastdue') {
    return (
      <LittleText style={styles.textStyles}>
        Available: {prevScheduledTime} to {prevScheduledEndTime}
      </LittleText>
    );
  }
  return null;
};

ActivityDueDate.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityDueDate;
