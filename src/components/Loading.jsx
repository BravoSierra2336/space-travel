function Loading({ message = "Loading..." }) {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', opacity: 0.8 }}>{message}</p>
      </div>
    </div>
  );
}

export default Loading;
