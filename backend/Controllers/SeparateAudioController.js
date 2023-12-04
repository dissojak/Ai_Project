const { exec } = require("child_process");

exports.separateAudio = (req, res) => {
  if (!req.files || !req.files.video) {
    return res.status(400).send("No video file uploaded.");
  }

  const videoFile = req.files.video;

  const videoFilePath = `save/video/${videoFile.name}`;
  const outputAudioFilePath = `save/audio/${videoFile.name}.mp3`;

  videoFile.mv(videoFilePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    exec(
      `ffmpeg -i ${videoFilePath} -vn -acodec copy ${outputAudioFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          return res.status(500).send(error);
        }
        if (stderr) {
          return res.status(500).send(stderr);
        }
        return res.json({ audioUrl: outputAudioFilePath });
      }
    );
  });
};
