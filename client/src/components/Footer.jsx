export default function Footer() {
    return (
        <footer className="glass-panel no-hover" style={{
            marginTop: '2rem',
            padding: '1.5rem 2rem',
            position: 'relative',
            borderRadius: '1rem 1rem 0 0',
            borderBottom: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4rem'
        }}>
            {/* Left Group */}
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>Mohamed Tamim TURKI</p>
                <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>SAIED Nabil</p>
            </div>

            {/* Separator or just spacing */}
            <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>

            {/* Right Group */}
            <div style={{ textAlign: 'left' }}>
                <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>Noam BAROUKH</p>
                <p style={{ margin: '0.2rem 0', fontWeight: '500' }}>Reda EL HAJJAJI</p>
            </div>


        </footer>
    );
}
