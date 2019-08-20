var editCanvas = document.querySelector("#edit-canvas");
editCanvas.height = 400;
editCanvas.width = 600;

var ctx = editCanvas.getContext('2d');

// Category and Category Background
var categoryComponent = {
  properties: {
    text: function() {
      return document.querySelector('#category').value;
    }
  },
  draw: function() {
    this._bg();
    this._text();
  },
  _bg: function() {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 300, 600, 120);
  },
  _text: function() {
    ctx.save();
    ctx.translate(455, 325);
    editCanvas.style.letterSpacing = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.font = '48px Play sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.properties.text(), 0, 0);
    ctx.restore();
  }
}

// Background Image
var backgroundComponent = {
  properties: {
    domId: "#background",
  },
  draw: function() {
    this._addImage();
  },
  _addImage: function() {
    var file = document.querySelector(this.properties.domId).files[0];

    var background = new Image();
    background.crossOrigin = "Anonymous";
    var reader = new FileReader();

    background.onload = function() {
      sourceHeight = background.height;
      sourceWidth = background.width;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(background, 0, 0, sourceWidth, sourceHeight,
        0, 0, 600, 400);
      ctx.globalCompositeOperation = 'source-over';
    }

    if (file) {
      reader.addEventListener("load", function() {
        background.src = reader.result;
      }, false);

      reader.readAsDataURL(file);
    }

    if (!file && document.querySelector('#background-url').value !== '') {
      background.src = document.querySelector('#background-url').value;
    }
  }
}

// Logo

var logoComponent = {
  properties: {
    domId: "#logo",
  },
  draw: function() {
    this._addImage();
  },
  _addImage: function() {

    logo_image = new Image();
    logo_image.src = 'img/logo.png';
    logo_image.onload = function () {
      ctx.drawImage(logo_image,10, 308,100,86);
    }
  }
}

// main function to draw / redraw canvas
function draw() {
  //Draw Title Component
  ctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
  categoryComponent.draw();
  backgroundComponent.draw();
  logoComponent.draw();
  
}

document.addEventListener('DOMContentLoaded', function() {

  // Update Events
  document.querySelector('#category').addEventListener('change', draw);
  document.querySelector('#background')
    .addEventListener('change', draw);

  // Select Dropdowns to Material Styles
  var elems = document.querySelectorAll('select');
  instances = M.FormSelect.init(elems);

  draw();

  document.querySelector('#download-image').addEventListener('click', function() {
    //to png
    var img = document.createElement('img');
    img.src = editCanvas.toDataURL();
    var a = document.createElement('a');
    a.href = img.src;
    a.download = 'thumbnail.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
