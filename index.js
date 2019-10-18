"use strict";

const core = require("@actions/core");
const { IncomingWebhook } = require("@slack/webhook");

async function run() {
  try {
    const GITHUB = JSON.parse(core.getInput("GITHUB", { required: true }));
    const JOB = JSON.parse(core.getInput("JOB", { required: true }));
    const SLACK_WEBHOOK_URL = core.getInput("SLACK_WEBHOOK_URL", {
      required: true
    });

    const ACTION_NAME = core.getInput("ACTION_NAME");

    core.debug(GITHUB);
    core.debug(JOB);

    const message = new IncomingWebhook(SLACK_WEBHOOK_URL);
    await message.send({
      attachments: [
        {
          title: ACTION_NAME,
          color: {
            Success: "good",
            Cancelled: "warning",
            Failure: "danger"
          }[JOB.status],
          fields: [
            {
              title: "Workflow",
              value: `<${GITHUB.event.head_commit.url}/checks|${GITHUB.workflow}>`
            }
          ]
        }
      ]
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
