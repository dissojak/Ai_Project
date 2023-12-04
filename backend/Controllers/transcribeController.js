exports.transcribeAudio = async (apiKey, audioUrl) => {
  try {
    const response = await fetch('https://api.rev.ai/speechtotext/v1/jobs', {
      method: 'POST',
      body: JSON.stringify({
        source_config: {
          url: audioUrl,
        },
        metadata: 'This is a test', // Optional
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const jobId = data.id;
    return { jobId };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Transcription failed');
  }
};
