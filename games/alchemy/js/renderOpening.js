function renderOpening() {

    console.log(
        "renderOpening()",
        openingState
    );

    const sceneRoot =
        document.getElementById("sceneRoot");

    if (!sceneRoot) return;

    const visibleLines =
        openingState.lines.slice(
            0,
            openingState.index + 1
        );

    sceneRoot.innerHTML = `
        <div class="opening-container">
            ${visibleLines
        .map(
            line =>
                `<div class="opening-line">
                            ${line}
                        </div>`
        )
        .join("")}
        </div>
    `;
}