var editCanvas = document.querySelector("#edit-canvas");
editCanvas.height = 400;
editCanvas.width = 600;

var ctx = editCanvas.getContext('2d');

// Category and Category Background
var categoryComponent = {
  properties: {
    text: function() {
      return document.querySelector('#category').value;
    },
    /*bgColor: function() {
      return $("#category-color").colorpicker('getValue');
    }*/
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
    /*ctx.rotate(-0.5 * Math.PI);*/
    editCanvas.style.letterSpacing = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.font = '48px sans-serif';
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
    ctx.drawImage(logo_image, 100, 100);
    
    
   /* var file = document.querySelector(this.properties.domId).files[0];
    var background = new Image();
    background.crossOrigin = "Anonymous";
    var reader = new FileReader();

    background.onload = function() {
      sourceHeight = background.height;
      sourceWidth = background.width;
      ctx.drawImage(background, 0, 0, sourceWidth, sourceHeight,
        5, 5, 145, 145);
    }

    if (file) {
      reader.addEventListener("load", function() {
        background.src = reader.result;
      }, false);

      reader.readAsDataURL(file);
    }

    if (!file && document.querySelector('#logo-url').value !== '') {
      background.src = document.querySelector('#logo-url').value;
    }*/
  }
}

// main function to draw / redraw canvas
function draw() {
  //Draw Title Component
  ctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
  /*titleComponent.draw();*/
  categoryComponent.draw();
  backgroundComponent.draw();
  logoComponent.draw();

  //Store to local storage.. next
}

document.addEventListener('DOMContentLoaded', function() {

  // Update Events
  /*document.querySelector('#title').addEventListener('keyup', draw);*/
  document.querySelector('#category').addEventListener('change', draw);
  document.querySelector('#background')
    .addEventListener('change', draw);
  document.querySelector('#logo')
    .addEventListener('change', draw);

  // Any Query Params?
  if (getUrlParameter('background')) {
    $("#background-url").val(getUrlParameter('background'));
  }
  if (getUrlParameter('logo')) {
    $("#logo-url").val(getUrlParameter('logo'));
  }

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

// Helper function to get URL Query Params
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
