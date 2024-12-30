let isMainModalOpen = false; // Track if the main modal is open

// Fetch and display records
document.addEventListener("DOMContentLoaded", function() {
    fetch('records.json')
        .then(response => response.json())
        .then(data => {
            const collectionGrid = document.getElementById('collection-grid');
            data.forEach(record => {
                const recordDiv = document.createElement('div');
                recordDiv.className = 'record';
                recordDiv.setAttribute('onclick', 'openModal(this)');
                recordDiv.setAttribute('data-title', record.title);
                recordDiv.setAttribute('data-artist', record.artist);
                recordDiv.setAttribute('data-year', record.year);
                recordDiv.setAttribute('data-genre', record.genre);
                recordDiv.setAttribute('data-label', record.label);
                recordDiv.setAttribute('data-thumbnails', JSON.stringify(record.thumbnails));
                recordDiv.setAttribute('data-highres', JSON.stringify(record.highres));
                recordDiv.setAttribute('data-info', record.info);

                recordDiv.innerHTML = `
                    <img src="${record.cover}" alt="${record.title} Cover" class="album-cover">
                    <div class="info">
                        <h3 class="data-title">${record.title}</h3>
                        <p><strong>Artist:</strong> <span class="data-artist">${record.artist}</span></p>
                        <p><strong>Year:</strong> <span class="data-year">${record.year}</span></p>
                        <p><strong>Genre:</strong> <span class="data-genre">${record.genre}</span></p>
                        <p><strong>Record Label:</strong> <span class="data-label">${record.label}</span></p>
                    </div>
                `;
                collectionGrid.appendChild(recordDiv);
            });
        })
        .catch(error => console.error('Error fetching records:', error));
});

// Open modal function for album details
function openModal(record) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modal.style.display = 'block';
    isMainModalOpen = true; // Set the flag to true

    // Get the data for the selected album
    const title = record.getAttribute('data-title');
    const artist = record.getAttribute('data-artist');
    const year = record.getAttribute('data-year');
    const genre = record.getAttribute('data-genre');
    const label = record.getAttribute('data-label');
    const thumbnails = JSON.parse(record.getAttribute('data-thumbnails'));
    const highres = JSON.parse(record.getAttribute('data-highres'));
    const info = record.getAttribute('data-info');

    // Generate the content for the modal
    let content = `
        <h2>${title}</h2>
        <p><strong>Artist:</strong> ${artist}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Record Label:</strong> ${label}</p>
        <div class="thumbnails">`;

    // Add the thumbnails
    thumbnails.forEach((thumbnail, index) => {
        content += `<img src="${thumbnail}" alt="${title} Thumbnail ${index + 1}" class="thumbnail" onclick="openHighResImage('${highres[index]}')">`;
    });

    content += `</div>
        <p>${info}</p>`;

    modalBody.innerHTML = content;
}

// Open high-resolution image modal
function openHighResImage(imageSrc) {
    const highResModal = document.getElementById('highResModal');
    const highResImage = document.getElementById('highResImage');
    highResImage.src = imageSrc;
    highResModal.style.display = 'block';
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';

    // If closing the high-resolution modal, keep the main modal open if it was open before
    if (modalId === 'highResModal' && isMainModalOpen) {
        document.getElementById('modal').style.display = 'block';
    } else if (modalId === 'modal') {
        isMainModalOpen = false; // Reset the flag when closing the main modal
    }
}

// Add touch event listeners to close modal when touching outside the modal content on touch devices
window.ontouchstart = function(event) {
    const modal = document.getElementById('modal');
    const highResModal = document.getElementById('highResModal');
    if (event.target == highResModal) {
        highResModal.style.display = 'none';
        if (isMainModalOpen) {
            modal.style.display = 'block';
        }
    } else if (event.target == modal) {
        modal.style.display = 'none';
        isMainModalOpen = false;
    }
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    const highResModal = document.getElementById('highResModal');
    if (event.target == highResModal) {
        highResModal.style.display = 'none';
        if (isMainModalOpen) {
            modal.style.display = 'block';
        }
    } else if (event.target == modal) {
        modal.style.display = 'none';
        isMainModalOpen = false;
    }
}

// Close modal when pressing the Escape key
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('modal');
    const highResModal = document.getElementById('highResModal');
    if (event.key === 'Escape') {
        if (highResModal.style.display === 'block') {
            highResModal.style.display = 'none';
            if (isMainModalOpen) {
                modal.style.display = 'block';
            }
        } else {
            modal.style.display = 'none';
            isMainModalOpen = false;
        }
    }
});

// Filter albums based on search input
function filterAlbums() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const records = document.getElementsByClassName('record');

    Array.from(records).forEach(record => {
        const title = record.getAttribute('data-title').toLowerCase();
        const artist = record.getAttribute('data-artist').toLowerCase();
        const year = record.getAttribute('data-year').toLowerCase();
        const genre = record.getAttribute('data-genre').toLowerCase();
        const label = record.getAttribute('data-label').toLowerCase();

        if (title.includes(filter) || artist.includes(filter) || year.includes(filter) || genre.includes(filter) || label.includes(filter)) {
            record.style.display = '';
        } else {
            record.style.display = 'none';
        }
    });
}
