const filters = {
    brightness: { 
        value: 100, 
        default: 100, 
        min: 0, 
        max: 200, 
        unit: '%'
    },
    contrast:   { 
        value: 100, 
        default: 100, 
        min: 0, 
        max: 200, 
        unit: '%',
    },
    saturate:   { 
        value: 100, 
        default: 100, 
        min: 0, 
        max: 200, 
        unit: '%'
    },
    hueRotate:  { 
        value: 0,   
        default: 0,   
        min: 0, 
        max: 360, 
        unit: 'deg' 
    },
    blur:       { 
        value: 0,   
        default: 0,   
        min: 0, 
        max: 20,  
        unit: 'px'
    },
    grayscale:  { 
        value: 0,   
        default: 0,   
        min: 0, 
        max: 100, 
        unit: '%'
    },
    sepia:      { 
        value: 0,   
        default: 0,   
        min: 0, 
        max: 100, 
        unit: '%'
    },
    opacity:    { 
        value: 100, 
        default: 100, 
        min: 0, 
        max: 100, 
        unit: '%' 
    },
    invert:     { 
        value: 0,   
        default: 0,   
        min: 0, 
        max: 100, 
        unit: '%'
    }
};
const CSS_FILTER_NAME = {
    brightness: "brightness",
    contrast: "contrast",
    saturate: "saturate",
    hueRotate: "hue-rotate",
    blur: "blur",
    grayscale: "grayscale",
    sepia: "sepia",
    opacity: "opacity",
    invert: "invert"
};

const canvas = document.querySelector("#image-canvas");
const imageInp = document.querySelector("#img-inp");
const reset = document.querySelector("#reset-btn");
const download = document.querySelector("#down-btn");
const ctx = canvas.getContext("2d");
let file = null;
let image = null;

function createFilter(key, label, unit='%',value, min, max){
    const filter = document.createElement('div');
    filter.classList.add('filter');

    const input = document.createElement("input");
    input.type="range";
    input.id=key;
    input.min=min;
    input.max=max;
    input.value=value

    const p= document.createElement("p");
    p.textContent = label;

    input.addEventListener("input",()=>{
        filters[key].value = input.value;
        applyFilter();
    })

    filter.appendChild(p);
    filter.appendChild(input);

    return filter;
}


Object.keys(filters).forEach(key => {
    const filter = filters[key];
    const label = key.charAt(0).toUpperCase()+key.slice(1);
    const filterElement = createFilter(key, label, filter.unit, filter.value, filter.min, filter.max);
    document.querySelector('.filters').appendChild(filterElement);
})

imageInp.addEventListener("change", (e)=>{
    document.querySelector(".image-placeholder").style.display = "none";
    canvas.style.display="block";

    file = e.target.files[0];

    image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        applyFilter();
        URL.revokeObjectURL(image.src);
    }
})


function applyFilter() {
    if (!image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = Object.keys(filters).map((key) => {
        return `${CSS_FILTER_NAME[key]}(${filters[key].value}${filters[key].unit})`;
    }).join(' ');

    ctx.drawImage(image, 0, 0);
}

function resetFilters() {
    Object.keys(filters).forEach(key => {
        filters[key].value = filters[key].default;
        document.getElementById(key).value = filters[key].default;
    });
    applyFilter();
}

reset.addEventListener("click",()=>{
    resetFilters();
    applyFilter();
});

download.addEventListener("click",()=>{
    const link = document.createElement("a");
    link.download="edited.png";
    link.href=canvas.toDataURL();
    link.click();
})

const presets = {
    original: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        hueRotate: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    vintage: {
        brightness: 105,
        contrast: 90,
        saturate: 80,
        hueRotate: 0,
        blur: 0,
        grayscale: 0,
        sepia: 35,
        opacity: 100,
        invert: 0
    },

    blackWhite: {
        brightness: 105,
        contrast: 120,
        saturate: 0,
        hueRotate: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    warm: {
        brightness: 105,
        contrast: 105,
        saturate: 120,
        hueRotate: 10,
        blur: 0,
        grayscale: 0,
        sepia: 15,
        opacity: 100,
        invert: 0
    },

    cool: {
        brightness: 100,
        contrast: 105,
        saturate: 110,
        hueRotate: 200,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    dramatic: {
        brightness: 90,
        contrast: 140,
        saturate: 110,
        hueRotate: 0,
        blur: 0,
        grayscale: 10,
        sepia: 0,
        opacity: 100,
        invert: 0
    }
};

function applyPreset(preset) {
    Object.keys(preset).forEach(key => {
        filters[key].value = preset[key];

        const input = document.querySelector(`#${key}`);
        input.value = preset[key];
    });

    applyFilter();
}

document.querySelector(".presets").addEventListener("click", (e) => {
    if (!e.target.matches("button")) return;

    const presetName = e.target.dataset.preset;
    applyPreset(presets[presetName]);
});