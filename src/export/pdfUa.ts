/**
 * PDF/UA-1 Universal Accessibility Engine (ISO 14289-1)
 *
 * Enriches client-side compiled PDF documents with XMP RDF accessibility metadata,
 * language specification, Document Title preference, and MarkInfo tagging for
 * assistive technology screen readers.
 */

export interface PdfUaMetadata {
  /** Document title */
  title: string;
  /** Author or publishing entity */
  author?: string;
  /** Subject description */
  subject?: string;
  /** Document keywords */
  keywords?: string[];
  /** BCP-47 language tag (e.g. 'en-US', 'pt-PT') */
  language?: string;
  /** Generating tool signature */
  creatorTool?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates ISO 14289-1 (PDF/UA-1) XMP metadata XML packet.
 */
export function generatePdfUaXmp(meta: PdfUaMetadata): string {
  const title = escapeXml(meta.title || "Document");
  const author = escapeXml(meta.author || "");
  const subject = escapeXml(meta.subject || "");
  const lang = meta.language || "en-US";
  const dateStr = new Date().toISOString();
  const keywords = meta.keywords?.map(escapeXml).join(", ") || "";
  const tool = escapeXml(meta.creatorTool || "@ruivalente99/bibliotheca");

  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:pdfaExtension="http://www.aiim.org/pdfa/ns/extension/" xmlns:pdfaSchema="http://www.aiim.org/pdfa/ns/schema#" xmlns:pdfaProperty="http://www.aiim.org/pdfa/ns/property#">
      <pdfaExtension:schemas>
        <rdf:Bag>
          <rdf:li rdf:parseType="Resource">
            <pdfaSchema:schema>PDF/UA Universal Accessibility Schema</pdfaSchema:schema>
            <pdfaSchema:namespaceURI>http://www.aiim.org/pdfua/ns/id/</pdfaSchema:namespaceURI>
            <pdfaSchema:prefix>pdfuaid</pdfaSchema:prefix>
            <pdfaSchema:property>
              <rdf:Seq>
                <rdf:li rdf:parseType="Resource">
                  <pdfaProperty:name>part</pdfaProperty:name>
                  <pdfaProperty:valueType>Integer</pdfaProperty:valueType>
                  <pdfaProperty:description>PDF/UA version part</pdfaProperty:description>
                </rdf:li>
              </rdf:Seq>
            </pdfaSchema:property>
          </rdf:li>
        </rdf:Bag>
      </pdfaExtension:schemas>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/">
      <pdfuaid:part>1</pdfuaid:part>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:format>application/pdf</dc:format>
      <dc:title>
        <rdf:Alt>
          <rdf:li xml:lang="x-default">${title}</rdf:li>
        </rdf:Alt>
      </dc:title>
      ${author ? `<dc:creator><rdf:Seq><rdf:li>${author}</rdf:li></rdf:Seq></dc:creator>` : ""}
      ${subject ? `<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${subject}</rdf:li></rdf:Alt></dc:description>` : ""}
      <dc:language>
        <rdf:Bag>
          <rdf:li>${lang}</rdf:li>
        </rdf:Bag>
      </dc:language>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
      <pdf:Producer>${tool}</pdf:Producer>
      ${keywords ? `<pdf:Keywords>${keywords}</pdf:Keywords>` : ""}
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
      <xmp:CreateDate>${dateStr}</xmp:CreateDate>
      <xmp:ModifyDate>${dateStr}</xmp:ModifyDate>
      <xmp:CreatorTool>${tool}</xmp:CreatorTool>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

/**
 * Enriches a standard PDF Uint8Array with PDF/UA-1 accessibility tags and XMP metadata stream.
 */
export function enrichPdfWithPdfUa(
  pdfBytes: Uint8Array,
  metadata: PdfUaMetadata
): Uint8Array {
  const pdfText = new TextDecoder("latin1").decode(pdfBytes);
  const lang = metadata.language || "en-US";

  const objRegex = /(\d+)\s+(\d+)\s+obj/g;
  let maxObjNum = 0;
  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(pdfText)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > maxObjNum) maxObjNum = num;
  }

  const metaObjNum = maxObjNum + 1;
  const xmpContent = generatePdfUaXmp(metadata);
  const xmpBytes = new TextEncoder().encode(xmpContent);

  const xmpObjStr = `${metaObjNum} 0 obj\n<<\n  /Type /Metadata\n  /Subtype /XML\n  /Length ${xmpBytes.length}\n>>\nstream\n${xmpContent}\nendstream\nendobj\n`;

  const catalogRegex = /(\d+)\s+(\d+)\s+obj\s*<<([\s\S]*?\/Type\s*\/Catalog[\s\S]*?)>>\s*endobj/;
  let updatedPdfText = pdfText;

  if (catalogRegex.test(pdfText)) {
    updatedPdfText = pdfText.replace(catalogRegex, (fullMatch, objN, genN, dict) => {
      let newDict = dict;
      if (!newDict.includes("/ViewerPreferences")) {
        newDict += `\n  /ViewerPreferences << /DisplayDocTitle true >>`;
      }
      if (!newDict.includes("/MarkInfo")) {
        newDict += `\n  /MarkInfo << /Marked true >>`;
      }
      if (!newDict.includes("/Lang")) {
        newDict += `\n  /Lang (${lang})`;
      }
      if (!newDict.includes("/Metadata")) {
        newDict += `\n  /Metadata ${metaObjNum} 0 R`;
      }
      return `${objN} ${genN} obj\n<<${newDict}\n>>\nendobj`;
    });
  }

  const trailerIdx = updatedPdfText.lastIndexOf("trailer");
  if (trailerIdx === -1) {
    return pdfBytes;
  }

  const beforeTrailer = updatedPdfText.slice(0, trailerIdx);
  const trailerAndBeyond = updatedPdfText.slice(trailerIdx);

  const finalPdfText = `${beforeTrailer}\n${xmpObjStr}\n${trailerAndBeyond}`;
  const outBytes = new Uint8Array(finalPdfText.length);
  for (let i = 0; i < finalPdfText.length; i++) {
    outBytes[i] = finalPdfText.charCodeAt(i) & 0xff;
  }

  return outBytes;
}
