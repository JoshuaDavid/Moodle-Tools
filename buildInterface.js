function dashify(str) {
    // Replace all non word characters with dashes
    return str.replace(/\W+/g, "-");
}
function toSentenceCase(str) {
    var sentences = str.split(/[\.\?\!]+\s*/g);
    for(var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i];
        if(sentence.length) {
            var newSentence = sentence;
            newSentence = newSentence[0].toUpperCase() + newSentence.slice(1);
            str = str.replace(sentence, newSentence);
        }
    }
    return str;
}
function createInputDiv(name, defaultValue, isRequired) {
    var wrapper = document.createElement("div");
    var input = document.createElement("input");
    var label = document.createElement("label");
    input["id"] = dashify(name);
    input["name"] = dashify(name);
    if(defaultValue) input["value"] = defaultValue;
    label["for"] = dashify(name);
    label.innerHTML = toSentenceCase(name) + ":";
    if(isRequired) label.className = "required";
    wrapper.className = dashify(name);
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}
