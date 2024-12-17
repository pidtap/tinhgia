document.addEventListener("DOMContentLoaded", function () {
    const videoItems = document.querySelectorAll(".video-item");
    const videoPlayer = document.getElementById("videoPlayer");
    const videoTitle = document.getElementById("videoTitle");
    const videoDescription = document.getElementById("videoDescription");

    let visibleVideoItems = 5;

    videoItems.forEach((item, index) => {
        // Ẩn các video-item vượt quá số lượng hiển thị ban đầu
        if (index >= visibleVideoItems) {
            item.classList.add("hidden");
        }

        // Thêm sự kiện khi nhấp vào video-item
        item.addEventListener("click", function () {
            const videoLink = item.getAttribute("data-video");
            const description = item.getAttribute("data-description");

            // Cập nhật videoPlayer, title và description
            videoPlayer.src = videoLink;
            videoTitle.textContent = item.querySelector("p").textContent;
            videoDescription.textContent = description;

            // Cuộn đến header
            document.querySelector("header").scrollIntoView({ behavior: 'smooth' });

            // Xóa lớp "active" khỏi tất cả các video-item
            videoItems.forEach((i) => i.classList.remove("active"));

            // Thêm lớp "active" vào video-item được nhấp
            item.classList.add("active");
        });
    });

    // Thêm sự kiện scroll để hiển thị thêm video-item
    const videoList = document.querySelector(".video-list");
    videoList.addEventListener("scroll", function () {
        const scrollHeight = videoList.scrollHeight;
        const scrollPosition = videoList.scrollTop + videoList.clientHeight;

        if (scrollPosition >= scrollHeight - 10) {
            videoItems.forEach((item, index) => {
                if (index >= visibleVideoItems && index < visibleVideoItems + 5) {
                    item.classList.remove("hidden");
                    visibleVideoItems++;
                }
            });
        }
    });

    // Thêm sự kiện tìm kiếm video
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        videoItems.forEach(item => {
            const videoTitle = item.querySelector("p").textContent.toLowerCase();
            if (videoTitle.includes(searchTerm)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    });
});
