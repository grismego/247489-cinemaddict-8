export const createErrorTemplate = (error) => (
  `<div class="error">
    <p class="error__text">
      <strong>
        Something went wrong while loading movies. Check your connection or try again later
      </strong>
    </p>
    <p class="error__message">
      ${error.message}
    </p>
    <p class="error__stack">
      ${error.stack}
    </p>
  </div>`
);
