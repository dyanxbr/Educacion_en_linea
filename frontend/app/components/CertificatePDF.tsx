'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos del certificado
const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: '#f0f4ff',
        border: 'none',
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 30,
        color: '#3b5bdb',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
        fontFamily: 'Helvetica',
    },
    name: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#1a1a2e',
        fontFamily: 'Helvetica-Bold',
    },
    course: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#3b5bdb',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    profesor: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#555',
        fontFamily: 'Helvetica',
    },
    footer: {
        fontSize: 12,
        textAlign: 'center',
        color: '#777',
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        fontFamily: 'Helvetica',
    },
    line: {
        marginVertical: 20,
        borderBottom: 2,
        borderBottomColor: '#3b5bdb',
        width: '80%',
        marginHorizontal: 'auto',
    },
});

interface CertificatePDFProps {
    nombre: string;
    curso: string;
    profesor: string;
    fecha: string;
}

export function CertificatePDF({ nombre, curso, profesor, fecha }: CertificatePDFProps) {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Título */}
                <Text style={styles.title}>CERTIFICADO DE FINALIZACIÓN</Text>
                
                {/* Línea decorativa */}
                <View style={styles.line} />
                
                {/* Contenido */}
                <Text style={styles.subtitle}>Se certifica que</Text>
                <Text style={styles.name}>{nombre}</Text>
                <Text style={styles.subtitle}>ha completado satisfactoriamente el curso</Text>
                <Text style={styles.course}>"{curso}"</Text>
                
                {/* Profesor (si existe) */}
                {profesor && profesor !== 'null' && (
                    <Text style={styles.profesor}>Impartido por: {profesor}</Text>
                )}
                
                {/* Fecha */}
                <Text style={styles.footer}>Fecha de emisión: {fecha}</Text>
            </Page>
        </Document>
    );
}