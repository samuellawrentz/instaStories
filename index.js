const { IgApiClient, IgCheckpointError } = require('instagram-private-api');
const { get } = require('request-promise');
const ig = new IgApiClient();
const delay = require('delay');
const Bluebird = require('bluebird');
const StickerBuilder = require('instagram-private-api/dist/sticker-builder').StickerBuilder;

async function login() {
    // basic login-proce
    ig.state.generateDevice('');
    return Bluebird.try(async () => {
      const auth = await ig.account.login('', '');
      console.log(auth);
    }).catch(IgCheckpointError, async () => {
      console.log(ig.state.checkpoint); // Checkpoint info here
      await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
      console.log(ig.state.checkpoint); // Challenge info here
      console.log(await ig.challenge.sendSecurityCode(1));
    }).catch(e => console.log('Could not resolve checkpoint:', e, e.stack));
  }

  async function publish() {
    await login();
    const imageBuffer = await get({
        url: 'https://heleneinbetween.com/wp-content/uploads/2018/09/Insta-Crushes-Story-Template-1..jpg', // random picture with 800x800 size
        encoding: null, // this is required, only this way a Buffer is returned
      });
  
    /**
     *  You can move and rotate stickers by using one of these methods:
     *  center()
     *  rotateDeg(180) rotates 180°
     *  scale(0.5) scales the sticker to 1/2 of it's size
     *  moveForward() moves the sticker in front
     *  moveBackwards() moves the sticker in the background
     *  right() aligns the sticker to the right
     *  left() aligns the sticker to the left
     *  top() aligns the sticker to the top
     *  bottom() aligns the sticker to the bottom
     *
     *  All of these are chainable e.g.:
     *  StickerBuilder.hashtag({ tagName: 'tag' }).scale(0.5).rotateDeg(90).center().left()
     *  You can also set the position and size like this:
     *  StickerBuilder.hashtag({
     *     tagName: 'insta',
     *     width: 0.5,
     *     height: 0.5,
     *     x: 0.5,
     *     y: 0.5,
     *   })
     */
  
    // these stickers are 'invisible' and not 're-rendered' in the app
    await ig.publish.story({
      file: imageBuffer,
      // this creates a new config
      stickerConfig: new StickerBuilder()
        // these are all supported stickers
        // you can also set different values for the position and dimensions
        .add(
            StickerBuilder.hashtag({
              tagName: 'motivation',
            }).bottom().right(),
          )
        .build(),
    });
  }

  async function run(){
      await login();
      await publish();
  }

  run();