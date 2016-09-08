class HiddenImage {
  constructor(imagePath, row, col, seed, clearTrigger) {
    this._imagePath = imagePath;
    if(seed) this._rndFunction = new Math.seedrandom(seed.toString());
    row = Math.min(row, 25);
    col = Math.min(col, 25);

    this._rowCount = row;
    this._colCount = col;

    this._numTiles = row * col;
    this._wallMap = new Array(col);
    for(let x = 0; x < col; x++) {
      this._wallMap[x] = new Array(row);
      for(let y = 0; y < row; y++) {
        this._wallMap[x][y] = new createjs.Shape();
      }
    }

    this._clearTrigger = clearTrigger;
  }

  addTo(container) {
    container.name = "HiddenImage";
    this.createImage(container);
  }

  createImage(container) {
    let imageObject = new createjs.Bitmap(this._imagePath);


    let hiddenImageObject = new createjs.Container();

    imageObject.image.onload = function() {
      // Keep aspect ratio
      let scale = Math.min((9/10 * container.width) / imageObject.image.width, (0.6 * container.height) / imageObject.image.height);
      imageObject.scaleX = imageObject.scaleY = scale;
      let width = imageObject.image.width * imageObject.scaleX;
      let height = imageObject.image.height * imageObject.scaleY;

      hiddenImageObject.x = - width / 2;
      hiddenImageObject.y = - height / 2;

      hiddenImageObject.addChild(imageObject, this.createWall(width, height));

      container.addChild(hiddenImageObject);
    }.bind(this);
  }

  createWall(width, height) {
    let wallObject = new createjs.Container();

    let tileWidth = width / this._colCount;
    let tileHeight = height / this._rowCount;

    for(let x = 0; x < this._colCount; x++) {
      for(let y = 0; y < this._rowCount; y++) {
        let tile = this._wallMap[x][y];
        if(tile) {
          tile.graphics.clear()
            .setStrokeStyle(2)
            .beginStroke("#fff")
            .beginFill(x % 2 == y % 2 ? "#a11201" : "#c2382e")
            .drawRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          tile.x = tileWidth * (x + 1/2);
          tile.y = tileHeight * (y + 1/2);
          tile.regX = tileWidth * (x + 1/2);
          tile.regY = tileHeight * (y + 1/2);
          tile.cache(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          wallObject.addChild(tile);
        }
      }
    }

    return wallObject;
  }

  removeRandomTile(amount) {
    while(this._numTiles && amount-- > 0) {
      let randomTileCounter = Common.getRandomNumber(0, this._numTiles, this._rndFunction);

      outerLoop:
        for(let x = 0; x < this._colCount; x++) {
          for(let y = 0; y < this._rowCount; y++) {
            let randomTile = this._wallMap[x][y];
            if(randomTile) {
              randomTileCounter--;
              if(randomTileCounter <= 0) {
                this._wallMap[x][y] = null;
                this.removeTile(randomTile);
                break outerLoop;
              }
            }
          }
        }
    }
  }

  removeTile(tileObject) {
    if(this._numTiles <= 0) return;
    this._numTiles--;
    if(this._numTiles == 0) this._clearTrigger();
    tileObject.filters = [ new createjs.ColorFilter(1.5,1.5,1,1) ];
    tileObject.updateCache();
    createjs.Tween.get(tileObject, { loop: false })
      .wait(500)
      .to({ alpha:0, rotation:540 }, 2000, createjs.Ease.getPowInOut(3))
      .call(function(tileObject) {
        tileObject.parent.removeChild(tileObject);
      }, [tileObject]);
  }

  uncoverAll() {
    this.removeRandomTile(this._numTiles);
  }

}
