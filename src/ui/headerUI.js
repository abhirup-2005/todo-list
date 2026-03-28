import { setView } from "./appUI.js";

const headerBtns = document.querySelectorAll(".header-nav-button");
headerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const view = btn.dataset.view;
        switch (view) {
            case "notification":
                break;
            case "trash":
                setView({
                    title: "Trash",
                    type: btn.dataset.view,
                    projectId: null
                });
        }
    })
})