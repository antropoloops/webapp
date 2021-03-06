import ctx from "./context";

//const GITHUB = "https://antropoloops.github.io/audiosets/";
const STORAGE = "https://storage.googleapis.com/atpls-sets/";

const events = {
  emit(type, event) {
    //console.log("LOAD AUDIO", type, event);
  }
};

export default function loadAudio(audioset, buffers) {
  const { clips, loader } = audioset;
  console.log("Loading audio...", audioset);
  return loadClips(buffers, clips, loader.sources.audio);
}

function loadClips(buffers, clips, urls) {
  const names = Object.keys(clips);
  events.emit("/audio/load-all", names);

  const promises = names.map(function(name) {
    const clip = clips[name];
    const url = urls[0].replace("{{filename}}", clip.name);
    return fetchLocalOrRemote(url)
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(audioData) {
        return ctx.decodeAudioData(audioData);
      })
      .then(function(buffer) {
        events.emit("/audio/file-loaded", name);
        buffers[name] = buffer;
      });
  });
  return Promise.all(promises).then(function(buffers) {
    events.emit("/audio/all-loaded");
    return buffers;
  });
}

function fetchLocalOrRemote(url) {
  if (process.env.NODE_ENV !== "production") {
    // See audiofiles module
    const local = url.replace(STORAGE, "http://localhost:7878/");
    return fetch(local).catch(function() {
      return fetch(url);
    });
  } else {
    return fetch(url);
  }
}
