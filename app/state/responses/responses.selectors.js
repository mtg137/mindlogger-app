import { createSelector } from "reselect";
import * as R from "ramda";
import { testVisibility } from "../../services/visibility";
import { IS_VIS } from "../../models/json-ld";

export const responsesSelector = R.path(["responses", "responseHistory"]);

export const uploadQueueSelector = R.path(["responses", "uploadQueue"]);

export const isDownloadingResponsesSelector = R.path([
  "responses",
  "isDownloadingResponses",
]);

export const isSummaryScreenSelector = R.path(["responses", "isSummaryScreen"]);

export const downloadProgressSelector = R.path([
  "responses",
  "downloadProgress",
]);

export const inProgressSelector = R.path(["responses", "inProgress"]);

export const activityOpenedSelector = R.path(["responses", "activityOpened"]);

export const responseScheduleSelector = R.path(["responses", "schedule"]);

export const currentAppletResponsesSelector = createSelector(
  responsesSelector,
  R.path(["app", "currentApplet"]),
  (responses, currentApplet) => {
    let currentAppletResponses = R.filter(
      (x) => x.appletId === currentApplet,
      responses
    );
    if (currentAppletResponses.length === 1) {
      // eslint-disable-next-line
      currentAppletResponses = currentAppletResponses[0];
    } else {
      currentAppletResponses = {};
    }
    return currentAppletResponses;
  }
);

export const currentAppletTokenBalanceSelector = createSelector(
  currentAppletResponsesSelector,
  (responseHistory) => {
    return responseHistory.tokens;
  }
)

export const currentResponsesSelector = createSelector(
  R.path(["app", "currentActivity"]),
  R.path(["app", "currentApplet"]),
  inProgressSelector,
  (activityId, appletId, inProgress) => {
    return inProgress[appletId + activityId]
  }
);

export const currentScreenSelector = createSelector(
  currentResponsesSelector,
  R.path(["screenIndex"])
);

export const itemVisiblitySelector = createSelector(
  currentResponsesSelector,
  (current) => {
    if (!current) {
      return [];
    }
    const { responses, activity } = current;

    return activity.addProperties.map((property) =>
      testVisibility(property[IS_VIS][0]['@value'], activity.items, responses)
    );
  }
);
